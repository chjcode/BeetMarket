# 필수 모듈 임포트
import asyncio, os, io, contextlib, logging
from urllib.parse import urlparse
from pathlib import PurePosixPath

from redis.asyncio import Redis        # 비동기 Redis 클라이언트
from minio import Minio               # MinIO 클라이언트
from PIL import Image                 # 이미지 처리용 라이브러리 (Pillow)
import aiomysql                       # 비동기 MySQL 클라이언트
from dotenv import load_dotenv        # .env 환경변수 로딩

### ─────────────────────────── 초기 설정 ───────────────────────────

load_dotenv()  # .env 파일에서 환경변수 불러오기
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

### ─────────────────────────── Redis 설정 ───────────────────────────

redis = Redis.from_url(
    os.getenv("REDIS_URL"),
    password=os.getenv("REDIS_PWD")
)

# Redis Stream 설정 (이미지 처리 작업 메시지를 받는 스트림)
IMAGE_STREAM  = os.getenv("REDIS_STREAM_IMAGE",  "image-process-stream")
GROUP         = os.getenv("REDIS_CONSUMER_GROUP","media-workers")
CONSUMER      = os.getenv("REDIS_CONSUMER_NAME", "worker-1")

### ─────────────────────────── MinIO 설정 ───────────────────────────

minio_client = Minio(
    os.getenv("MINIO_ENDPOINT"),
    access_key=os.getenv("MINIO_ACCESS_KEY"),
    secret_key=os.getenv("MINIO_SECRET_KEY"),
    secure=os.getenv("MINIO_SECURE","false").lower() == "true"  # "true"면 HTTPS 사용
)
BUCKET = os.getenv("MINIO_BUCKET", "uploads")                  # 기본 버킷
PUBLIC_BASE = os.getenv("MINIO_PUBLIC_BASE").rstrip("/")       # public URL prefix

### ─────────────────────────── MySQL 풀 생성 ───────────────────────────

mysql_pool = None

async def init_mysql_pool():
    global mysql_pool
    mysql_pool = await aiomysql.create_pool(
        host       = os.getenv("MYSQL_HOST"),
        port       = int(os.getenv("MYSQL_PORT", 3306)),
        user       = os.getenv("MYSQL_USER"),
        password   = os.getenv("MYSQL_PWD"),
        db         = os.getenv("MYSQL_DB"),
        minsize    = 1,
        maxsize    = int(os.getenv("MYSQL_POOL_SIZE", 10)),
        autocommit = True,
        charset    = "utf8mb4"
    )

### ─────────────────────────── 유틸 함수 ───────────────────────────

def _parse_path(public_url: str) -> tuple[str, str]:
    """
    public 또는 presigned URL로부터 MinIO object 경로와 확장자 추출
    예: https://.../uploads/6/uuid/file.jpg → ("6/uuid/file.jpg", ".jpg")
    """
    path = urlparse(public_url).path
    object_name = PurePosixPath(path).relative_to(f"/{BUCKET}").as_posix()
    return object_name, os.path.splitext(object_name)[1].lower()

def _download_from_minio(obj: str) -> bytes:
    """
    MinIO에서 객체 다운로드 (바이트로 반환)
    """
    return minio_client.get_object(BUCKET, obj).read()

def _upload_to_minio(obj: str, data: bytes, content_type: str):
    """
    MinIO에 객체 업로드
    """
    minio_client.put_object(
        bucket_name = BUCKET,
        object_name = obj,
        data        = io.BytesIO(data),
        length      = len(data),
        content_type= content_type
    )

def _public_url(obj: str) -> str:
    """
    업로드된 MinIO 객체의 public 접근 URL 생성
    """
    return f"{PUBLIC_BASE}/{BUCKET}/{obj}"

def generate_preview(jpg_bytes: bytes,
                     max_size:int = int(os.getenv("PREVIEW_MAX_SIZE", 720)),
                     quality :int = int(os.getenv("PREVIEW_QUALITY", 30))) -> bytes:
    """
    원본 이미지 바이트를 받아 저화질 미리보기 이미지 생성
    - 썸네일 크기 제한 (max_size x max_size)
    - 품질 조정 (default: 30%)
    - 반환값은 JPEG 바이트
    """
    with Image.open(io.BytesIO(jpg_bytes)) as img:
        img.thumbnail((max_size, max_size))  # 썸네일 크기 조정
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=quality)
        return buf.getvalue()

async def update_db_preview(pool, post_uuid: str, origin_url: str, preview_url: str):
    """
    image 테이블의 image_preview 필드를 업데이트
    - post 테이블의 uuid와 원본 이미지 URL을 기준으로 매칭
    """
    sql = """
        UPDATE image i
          JOIN post p ON p.id = i.post_id
           SET i.image_preview = %s
         WHERE i.image_origin = %s
           AND p.uuid         = %s
    """
    async with pool.acquire() as conn, conn.cursor() as cur:
        await cur.execute(sql, (preview_url, origin_url, post_uuid))
        logging.info("post_uuid : (%s)", post_uuid)
        logging.info("origin_url : (%s)", origin_url)
        logging.info("preview_url : (%s)", preview_url)
        logging.info("DB update (%s) affected %s rows", preview_url, cur.rowcount)

### ─────────────────────────── 메시지 처리 ───────────────────────────

async def handle_message(msg_id: str, fields: dict):
    """
    Redis Stream으로부터 받은 메시지 1건 처리
    - 이미지 URL 목록 순회하며 미리보기 생성, 업로드 및 DB 갱신
    """
    post_uuid = fields.get("postUuid")
    if not post_uuid:
        logging.error("Missing required field: postUuid in message %s", fields)
        return 
    urls = fields.get("imageUrls", "").split(",")

    for origin in urls:
        obj, ext = _parse_path(origin)
        if ext not in (".jpg", ".jpeg", ".png", ".webp"):
            continue  # 이미지가 아닌 경우 생략

        try:
            origin_bytes  = _download_from_minio(obj)
            preview_bytes = generate_preview(origin_bytes)
            preview_name  = obj.rsplit(".",1)[0] + "_preview.jpg"

            _upload_to_minio(preview_name, preview_bytes, "image/jpeg")
            preview_url = _public_url(preview_name)

            await update_db_preview(mysql_pool, post_uuid, origin, preview_url)
            logging.info("[%s] preview ready → %s", post_uuid, preview_url)

        except Exception as e:
            logging.exception("[%s] failed on %s: %s", post_uuid, origin, e)

    # 해당 메시지를 ack하여 Redis에서 처리 완료 표시
    await redis.xack(IMAGE_STREAM, GROUP, msg_id)

### ─────────────────────────── Redis 소비자 루프 ───────────────────────────

async def ensure_group():
    """
    Redis Stream Consumer Group이 존재하지 않으면 생성
    """
    try:
        await redis.xgroup_create(name=IMAGE_STREAM, groupname=GROUP, id="0", mkstream=True)
    except Exception as e:
        if "BUSYGROUP" not in str(e):  # 이미 그룹이 존재하면 무시
            raise

async def consume_loop():
    """
    Redis Stream을 지속적으로 소비하면서 메시지를 처리
    """
    await ensure_group()
    while True:
        resp = await redis.xreadgroup(
            groupname    = GROUP,
            consumername = CONSUMER,
            streams      = {IMAGE_STREAM: ">"},
            count        = 10,
            block        = 5000  # 최대 5초 대기
        )
        if not resp:  # 타임아웃인 경우 루프 재시작
            continue

        for _stream, messages in resp:
            for msg_id, f in messages:
                str_f = {k.decode(): v.decode() for k,v in f.items()}  # 바이너리 → 문자열 변환
                await handle_message(msg_id.decode(), str_f)

### ─────────────────────────── 메인 진입점 ───────────────────────────

async def main():
    await init_mysql_pool()
    await consume_loop()

# 스크립트 실행
if __name__ == "__main__":
    asyncio.run(main())
