# 🧩 3D 기반 중고거래 플랫폼, 비트마켓 (BitMarket)

> 📁 이 저장소는 SSAFY 12기 특화 프로젝트 **「비트마켓」** 중  
> 제가 직접 구현한 **백엔드 핵심 기능 중심**으로 구성된 개인 포트폴리오입니다.  
> 전체 프로젝트는 2025년 4월부터 5월까지 약 5주간 진행되었습니다.

<br>

## 🛠️ 기술 스택

### Backend
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![JPA](https://img.shields.io/badge/JPA-007396?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

### Infra
![Docker](https://img.shields.io/badge/Docker-2496ed?style=for-the-badge&logo=docker&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-d24939?style=for-the-badge&logo=jenkins&logoColor=white)
![EC2](https://img.shields.io/badge/EC2-ff9900?style=for-the-badge&logo=amazonEC2&logoColor=white)
![MinIO](https://img.shields.io/badge/MinIO-cf2e2e?style=for-the-badge)

### Tools
![GitLab](https://img.shields.io/badge/GitLab-fc6d26?style=for-the-badge&logo=gitlab&logoColor=white)
![Jira](https://img.shields.io/badge/Jira-0052cc?style=for-the-badge&logo=jira&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)

<br>

## 🏗️ 시스템 아키텍처

![architecture](./image/시스템아키텍처.png)

- Spring Boot API 서버 + 채팅 서버
- Redis: Pub/Sub, Set, Stream 전반 활용
- MongoDB + MySQL 이중 저장소 구성
- MinIO: 사용자 업로드 미디어 저장소
- Jenkins + EC2 기반 CI/CD 구축
- 외부 연동 API: ChatGPT, Meshroom

<br>

## 🧑‍💻 담당 역할

- Redis 기반 **1:1 실시간 채팅 시스템** 설계 및 구현
- **미디어 비동기 처리 구조** 설계 (Presigned URL + Redis Stream + Worker)
- **OAuth 소셜 로그인 및 JWT 인증/인가** 로직 구현
- **ChatGPT API 연동**을 통한 채팅 기반 거래 약속 추천 자동화
- 시스템 아키텍처 설계 및 배포 환경 구성 참여

<br>

## 💡 주요 구현 기능

### ✅ 실시간 채팅 시스템
- **Redis Set**을 이용한 채팅방 참여자 관리 및 입장/퇴장 추적
- **Redis Pub/Sub**을 통해 실시간 메시지 송수신 및 읽음 처리 브로드캐스트
- **MongoDB**에 읽음 커서(`lastReadId`) 저장하여 `O(1)` 복잡도로 미읽음 메시지 수 계산
- 수신자 미접속 시 **알림(Notification)** 자동 저장 및 발송
- ![](./image/채팅flow.png)

### ✅ 미디어 비동기 처리 시스템
- 클라이언트는 **Presigned URL**로 직접 MinIO에 이미지/영상 업로드
- 업로드 완료 후 Redis Stream에 변환 요청 메시지 등록
- **Python 기반 Worker**가 Redis Stream을 비동기 소비 → 3D 모델 변환 및 썸네일 생성 수행

### ✅ 인증/인가 시스템
- OAuth2(Google) 기반 소셜 로그인
- JWT 기반 사용자 인증/인가

### ✅ 거래 약속 자동 추천
- 채팅 메시지를 분석해 적절한 시간/장소 추천
- **ChatGPT API** 연동으로 대화 맥락 기반 자동화

<br>

## 🐞 트러블슈팅 사례

### 1. WebSocket 인증 문제
- **문제**: WebSocket 연결 시 `Authorization` 헤더 사용 불가
- **해결**: access-token을 `쿼리 파라미터`로 전달하여 인증 처리

### 2. 배포 환경에서 WebSocket 연결 실패
- **문제**: 프론트 배포 환경에서 WebSocket 연결 자체가 되지 않음
- **해결**: `.withSockJS()` 제거 → 순수 WebSocket으로 구조 단순화

<br>

## 🖼️ 이미지
![](./image/비트마켓.png)
![](./image/메인페이지.png)
![](./image/게시글페이지.png)
![](./image/3d페이지.png)
![](./image/채팅.png)