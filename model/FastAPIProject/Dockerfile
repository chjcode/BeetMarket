FROM python:3.13.3-slim

# 작업 디렉토리 설정
WORKDIR /app

# requirements 및 소스 복사
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

# worker.py 실행
CMD ["python", "app/worker.py"]