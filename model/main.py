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
        file.write(s + "\n")


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



# CLI 실행 명령 매핑
NODE_EXECUTABLES = {
    "CameraInit": "aliceVision_cameraInit",
    "FeatureExtraction": "aliceVision_featureExtraction",
    "ImageMatching": "aliceVision_imageMatching",
    "FeatureMatching": "aliceVision_featureMatching",
    "StructureFromMotion": "aliceVision_structureFromMotion",
    "PrepareDenseScene": "aliceVision_prepareDenseScene",
    "DepthMap": "aliceVision_depthMap",
    "DepthMapFilter": "aliceVision_depthMapFilter",
    "Meshing": "aliceVision_meshing",
    "MeshFiltering": "aliceVision_meshFiltering",
    "Texturing": "aliceVision_texturing"
}

def format_inputs(inputs: dict, context: dict) -> list:
    args = []
    for k, v in inputs.items():
        if isinstance(v, dict) or isinstance(v, list):
            continue  # 생략 (복잡한 옵션 제외)
        value = str(v)
        for key, val in context.items():
            value = value.replace(f"{{{key}}}", val)
        args.append(f"--{k}={value}")
    return args

def execute_node(name: str, node: dict, context: dict):
    node_type = node["nodeType"]
    exec_name = NODE_EXECUTABLES.get(node_type)
    if not exec_name:
        print_log(f"⚠️ {node_type}은 지원되지 않음. 스킵")
        return

    inputs = node.get("inputs", {})
    args = format_inputs(inputs, context)

    output_folder = node["internalFolder"].replace("{cache}", context["cache"]).replace("{nodeType}", node_type)
    output_folder = output_folder.replace("{uid0}", list(node["uids"].values())[0])
    os.makedirs(output_folder, exist_ok=True)

    print_log(f"\n▶ 실행: {exec_name}")
    print_log(f"   위치: {output_folder}")
    full_cmd = [exec_name] + args
    print_log("   명령:" + " ".join(full_cmd))

    result = subprocess.run(full_cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    print_log(result.stdout)

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

        MG_FILE = "photogrammetry.mg"
        CACHE_DIR = Path("cache")
        INPUT_DIR = str(frames_dir)

        with open(MG_FILE, "r") as f:
            mg = json.load(f)
        context = {
            "cache": str(CACHE_DIR),
            "input": INPUT_DIR
        }

        # 노드 정렬
        graph = mg["graph"]
        sorted_nodes = sorted(graph.items(), key=lambda x: x[1]["position"][0])
        for name, node in sorted_nodes:
            execute_node(name, node, context)

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