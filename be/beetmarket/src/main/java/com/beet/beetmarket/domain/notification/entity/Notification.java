package com.beet.beetmarket.domain.notification.entity;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String userNickname;

    private NotificationType type;

    private String message;

    private String link;

    private boolean isRead;

    private LocalDateTime createdAt;

    private String relatedEntityId;

    private String senderNickname;
}