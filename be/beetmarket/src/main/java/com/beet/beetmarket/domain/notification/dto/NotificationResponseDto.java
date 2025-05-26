package com.beet.beetmarket.domain.notification.dto;

import com.beet.beetmarket.domain.notification.entity.Notification;
import com.beet.beetmarket.domain.notification.entity.NotificationType;
import java.time.LocalDateTime;

public record NotificationResponseDto(
    String id,
    String userNickname,
    NotificationType type,
    String message,
    String link,
    boolean isRead,
    LocalDateTime createdAt,
    String relatedEntityId,
    String senderNickname
) {
    public static NotificationResponseDto fromEntity(Notification entity) {
        return new NotificationResponseDto(
            entity.getId(),
            entity.getUserNickname(),
            entity.getType(),
            entity.getMessage(),
            entity.getLink(),
            entity.isRead(),
            entity.getCreatedAt(),
            entity.getRelatedEntityId(),
            entity.getSenderNickname()
        );
    }
}