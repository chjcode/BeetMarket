package com.beet.chatserver.domain.notification.entity;

import java.time.LocalDateTime; // Instant 대신 LocalDateTime 사용 (생성 시간 표시 목적)
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String userNickname; // 알림을 받을 사용자 닉네임 (Principal의 name)

    private NotificationType type; // 알림 종류

    private String message; // 알림 내용

    private String link;    // 클릭 시 이동할 URL (예: 특정 채팅방)

    private boolean isRead; // 읽음 여부

    private LocalDateTime createdAt; // 생성 시간

    private String relatedEntityId; // 관련된 엔티티 ID (예: 채팅방 ID, 메시지 ID 등)

    // 예시: 채팅 알림의 경우, 발신자 닉네임을 저장할 수 있습니다.
    private String senderNickname; // NEW_CHAT_MESSAGE 타입일 경우 발신자 닉네임
}