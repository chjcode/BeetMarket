from minio import Minio
from minio.error import S3Error
from dotenv import load_dotenv
import subprocess
import os
import redis
import mysql.connector
import time
from pathlib import Path

def str_to_bool(s: str) -> bool:
    return s.lower() in ("true", "1", "yes", "y")



# 환경 변수 로드
load_dotenv(dotenv_path="model.env")

MINIO_SECURE = str_to_bool(os.getenv("MINIO_SECURE"))
r = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=6379,
    password=os.getenv("REDIS_PASSWORD"),
    decode_responses=True
)
REDIS_STREAM_KEY=os.getenv("REDIS_STREAM_KEY")
REDIS_GROUP_NAME=os.getenv("REDIS_GROUP_NAME")
REDIS_CONSUMER_NAME=os.getenv("REDIS_CONSUMER_NAME")
try:
    r.xgroup_create(REDIS_STREAM_KEY, REDIS_GROUP_NAME, id='0', mkstream=True)
except redis.exceptions.ResponseError as e:
    print(str(e))

print("Worker started.")

minio_client = Minio(
    os.getenv("MINIO_ENDPOINT"),
    access_key=os.getenv("MINIO_ACCESS_KEY"),
    secret_key=os.getenv("MINIO_SECRET_KEY"),
    secure=True
)

conn = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST"),
    port=3306,
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    database=os.getenv("MYSQL_DATABASE")
)
cursor = conn.cursor()

MINIO_BUCKET = os.getenv("MINIO_BUCKET")

LOCAL_VIDEOS_DIR = os.getenv("LOCAL_VIDEOS_DIR")
LOCAL_FRAMES_DIR = os.getenv("LOCAL_FRAMES_DIR")
LOCAL_MODELS_DIR = os.getenv("LOCAL_MODELS_DIR")
PIPELINE_FILE = Path("./photogrammetry.mg")
MESHROOM_PATH = Path(os.getenv("MESHROOM_PATH"))

# app = FastAPI()

def process_video(userId: int, uuid: str, filename: str, postId: int):
    # 디렉토리 경로 구성 (예: videos/123/sample.mp4)
    video_dir = Path(LOCAL_VIDEOS_DIR) / uuid
    frames_dir = Path(LOCAL_FRAMES_DIR) / uuid


    # 디렉토리 생성
    video_dir.mkdir(parents=True, exist_ok=True)
    frames_dir.mkdir(parents=True, exist_ok=True)
    print(f"filename : ${filename}")
    # MinIO에서 파일 다운로드
    minio_client.fget_object(bucket_name=MINIO_BUCKET, object_name=filename, file_path=str(video_dir / "video.mp4"))

    # ffmpeg로 프레임 추출
    output_pattern = str(frames_dir / "frame_%04d.jpg")
    command = [
        "ffmpeg",
        "-i", Path(video_dir) / "video.mp4",
        "-vf", "fps=1", "-q:v", "3",
        output_pattern
    ]
    subprocess.run(command, check=True)

    print(f"사진 추출 완료: postId={postId}, filename={filename}")

    OUTPUT_DIR = Path(LOCAL_MODELS_DIR) / uuid
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    INPUT_DIR = str(frames_dir)
    cmd = [
        str(MESHROOM_PATH / "meshroom_batch.exe"),
        "--input", str(INPUT_DIR),
        "--output", str(OUTPUT_DIR),
        "--pipeline", str(PIPELINE_FILE)
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    print(result.stdout)

    UPLOAD_DIR = Path(f"/{userId}/{uuid}")
    MODEL_BUCKET = "model"
    OBJECT_NAMES = ['texture_1001.png', 'texturedMesh.mtl', 'texturedMesh.obj']
    for object in OBJECT_NAMES:
        try:
            minio_client.fput_object(
                MODEL_BUCKET,
                str(UPLOAD_DIR / object),
                str(OUTPUT_DIR / object)
            )
        except S3Error as err:
            print(f"에러 : {err}")
    model_public_url = f"https://k12a307.p.ssafy.io:8100/{MODEL_BUCKET}" + str(UPLOAD_DIR) + "/"
    cursor.execute("UPDATE post SET model_3d_url = %s WHERE id = %s", (model_public_url, postId))
    conn.commit()


while True:
    try:
        entries = r.xreadgroup(REDIS_GROUP_NAME, REDIS_CONSUMER_NAME, {REDIS_STREAM_KEY: '>'}, count=1, block=10000)
        if entries:
            for stream_key, messages in entries:
                for message_id, message_data in messages:
                    print("ID:", message_id)
                    print("Data:", message_data)
                    # do something

                    uuid = message_data['uuid']
                    filename = message_data['videoUrl']
                    prefix = "https://k12a307.p.ssafy.io:8100/uploads"
                    filename = filename.replace(prefix, "")
                    postId = message_data['postId']
                    userId = message_data['userId']
                    process_video(userId, uuid, filename, postId)

                    r.xack(REDIS_STREAM_KEY, REDIS_GROUP_NAME, message_id)
        else:
            print("No new messages...")
    except Exception as e:
        print(f"Error: {e}")
        time.sleep(1)





#
# @app.post("/process-video/")
# async def process_video(
#     uuid: str = Form(...),
#     filename: str = Form(...),
#     postId: int = Form(...),
#     background_tasks: BackgroundTasks = None
# ):
#     background_tasks.add_task(process_video_background, uuid, filename, postId)
#     return JSONResponse(content={"message": "처리 중", "filename": filename})