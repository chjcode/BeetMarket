FROM python:3.13.3-slim

# 작업 디렉토리 설정
WORKDIR /app

# requirements 및 소스 복사
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app
COPY ./models ./models

# FastAPI 실행
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8701"]
