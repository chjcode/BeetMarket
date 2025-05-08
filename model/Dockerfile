# FROM alicevision/meshroom:2023.3.0-av3.2.0-centos7-cuda11.3.1
#
# # 시스템 및 Python 빌드 필수 패키지 설치
# RUN yum update -y && \
#     yum groupinstall -y "Development Tools" && \
#     yum install -y \
#         gcc openssl-devel bzip2-devel libffi-devel wget make zlib-devel xz-devel \
#         sqlite-devel readline-devel tk-devel gdbm-devel libuuid-devel ncurses-devel \
#         libdb-devel tar epel-release && \
#     rpm -Uvh http://li.nux.ro/download/nux/dextop/el7/x86_64/nux-dextop-release-0-5.el7.nux.noarch.rpm && \
#     yum install -y ffmpeg ffmpeg-devel
#
# # Python 3.13 빌드 및 설치
# WORKDIR /usr/src
# RUN wget https://www.python.org/ftp/python/3.13.0/Python-3.13.0.tgz && \
#     tar xzf Python-3.13.0.tgz && \
#     cd Python-3.13.0 && \
#     ./configure --enable-optimizations && \
#     make -j$(nproc) && \
#     make altinstall
#
# # python3/pip3 심볼릭 링크 등록
# RUN ln -sf /usr/local/bin/python3.13 /usr/bin/python3 && \
#     ln -sf /usr/local/bin/pip3.13 /usr/bin/pip3 && \
#     /usr/local/bin/pip3.13 install --upgrade pip
#
# # 앱 설치 및 실행 준비
# WORKDIR /app
# COPY requirements.txt .
# RUN yum install openssl -y
#
# RUN pip3 install -r requirements.txt
#
# COPY . .
#
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port"]

FROM python:3.13

# 필수 시스템 패키지 설치 (AliceVision 실행에 필요한 라이브러리 포함)
RUN apt-get update && \
    apt-get install -y \
        cmake \
        git \
        gcc \
        libtool nasm \
        automake autoconf \
        build-essential \
        libboost-all-dev \
        libeigen3-dev \
        libtiff-dev \
        libpng-dev \
        libraw-dev \
        libopenexr-dev \
        libceres-dev \
        libsuitesparse-dev \
        libgoogle-glog-dev \
        wget \
        zip \
        unzip \
        ffmpeg \
        libgl1 \
        libglu1-mesa \
        libxrender1 \
        libxi6 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxext6 \
        libxtst6 \
        libxrandr2 \
        libdbus-1-3 \
        libnss3 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libxss1 \
        libasound2 \
        libgtk-3-0 \
        && apt-get clean && rm -rf /var/lib/apt/lists/*

# AliceVision CLI 바이너리 다운로드 및 설치
WORKDIR /opt
# RUN wget https://github.com/alicevision/AliceVision/archive/refs/tags/v3.2.0.tar.gz && \
#     tar -xzf v3.2.0.tar.gz && \
#     rm v3.2.0.tar.gz
RUN git clone https://github.com/alicevision/AliceVision.git --recursive
WORKDIR /opt/AliceVision
RUN git submodule update -i
WORKDIR /opt
RUN mkdir build
WORKDIR /opt/build
RUN cmake -DALICEVISION_BUILD_DEPENDENCIES=ON -DCMAKE_INSTALL_PREFIX=$PWD/../install ../AliceVision
RUN make VERBOSE=1 2>&1 | tee make.log
RUN make install

# PATH 환경변수에 AliceVision 바이너리 등록
ENV PATH="/opt/AliceVision/bin:$PATH"

# FastAPI, 기타 Python 패키지 설치
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 복사 및 실행 명령 설정
COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "debug"]

# FROM ubuntu:22.04
#
# ENV DEBIAN_FRONTEND=noninteractive
# WORKDIR /opt
#
# # 🧱 기본 의존성 설치 (Python + C++ 빌드용)
# RUN apt-get update && apt-get install -y \
#     wget curl git build-essential cmake \
#     libssl-dev zlib1g-dev libncurses5-dev libncursesw5-dev \
#     libreadline-dev libsqlite3-dev libgdbm-dev libdb5.3-dev \
#     libbz2-dev libexpat1-dev liblzma-dev tk-dev libffi-dev \
#     libgl1 libglu1-mesa libxrender1 libxi6 libxcomposite1 \
#     libxcursor1 libxdamage1 libxext6 libxtst6 libxrandr2 \
#     libdbus-1-3 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
#     libxss1 libasound2 libgtk-3-0 ffmpeg zip unzip \
#     && apt-get clean && rm -rf /var/lib/apt/lists/*
#
# # 🐍 Python 3.13.0 설치
# RUN wget https://www.python.org/ftp/python/3.13.0/Python-3.13.0.tgz && \
#     tar xzf Python-3.13.0.tgz && \
#     cd Python-3.13.0 && \
#     ./configure --enable-optimizations && \
#     make -j$(nproc) && \
#     make altinstall && \
#     ln -s /usr/local/bin/python3.13 /usr/bin/python && \
#     ln -s /usr/local/bin/pip3.13 /usr/bin/pip && \
#     cd .. && rm -rf Python-3.13.0*
#
# # 🛠️ AliceVision 소스 클론 및 빌드
# RUN git clone https://github.com/alicevision/AliceVision.git --recursive
# RUN mkdir /opt/build
# WORKDIR /opt/build
# RUN cmake -DALICEVISION_BUILD_DEPENDENCIES=ON -DCMAKE_INSTALL_PREFIX=/opt/install /opt/AliceVision
# RUN make -j10 VERBOSE=1
# RUN make install
#
# # 🔧 PATH 설정
# ENV PATH="/opt/install/bin:$PATH"
#
# # 🐍 FastAPI 및 Python 패키지 설치
# WORKDIR /app
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt
#
# # 💼 앱 소스 복사 및 실행
# COPY . .
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "debug"]