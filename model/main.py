from fastapi import FastAPI, BackgroundTasks, Form
from starlette.responses import JSONResponse
from minio import Minio
from dotenv import load_dotenv
import json
import subprocess
import os
from pathlib import Path

def str_to_bool(s: str) -> bool:
    return s.lower() in ("true", "1", "yues", "y")
def print_log(s: str):
    with open("print_log.txt", "a", encoding="utf-8") as file:
        file.write(s)


# 환경 변수 로드
load_dotenv(dotenv_path="model.env")
MINIO_SECURE = str_to_bool(os.getenv("MINIO_SECURE"))

minio_client = Minio(
    os.getenv("MINIO_ENDPOINT"),
    access_key=os.getenv("MINIO_ACCESS_KEY"),
    secret_key=os.getenv("MINIO_SECRET_KEY"),
    secure=MINIO_SECURE
)




MINIO_BUCKET = os.getenv("MINIO_BUCKET")

LOCAL_VIDEO_DIR = os.getenv("LOCAL_VIDEO_DIR")
LOCAL_FRAMES_DIR = os.getenv("LOCAL_FRAMES_DIR")

app = FastAPI()

def process_video_background(uuid: str, filename: str, postId: int):
    try:
        # 디렉토리 경로 구성 (예: videos/123/sample.mp4)
        video_dir = Path(LOCAL_VIDEO_DIR) / uuid
        frames_dir = Path(LOCAL_FRAMES_DIR) / str(postId)
        video_path = Path(LOCAL_VIDEO_DIR) / uuid / "video.mp4"

        # 디렉토리 생성
        video_dir.mkdir(parents=True, exist_ok=True)
        frames_dir.mkdir(parents=True, exist_ok=True)

        # MinIO에서 파일 다운로드
        minio_client.fget_object(MINIO_BUCKET, filename, str(video_path))

        # ffmpeg로 프레임 추출
        output_pattern = str(frames_dir / "frame_%04d.jpg")
        command = [
            "ffmpeg",
            "-i", str(video_path),
            "-vf", "fps=1", "-q:v", "3",
            output_pattern
        ]
        subprocess.run(command, check=True)

        print_log(f"사진 추출 완료: postId={postId}, filename={filename}")

    except Exception as e:
        print_log(f"작업 실패: postId={postId}, filename={filename}, 이유: {e}")


@app.post("/process-video/")
async def process_video(
    uuid: str = Form(...),
    filename: str = Form(...),
    postId: int = Form(...),
    background_tasks: BackgroundTasks = None
):
    background_tasks.add_task(process_video_background, uuid, filename, postId)
    return JSONResponse(content={"message": "처리 중", "filename": filename})