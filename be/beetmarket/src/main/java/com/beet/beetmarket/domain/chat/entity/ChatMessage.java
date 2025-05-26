package com.beet.beetmarket.domain.chat.entity;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor; // 기본 생성자 추가
import lombok.AllArgsConstructor; // 모든 필드 생성자 추가

@Document(collection = "chat_messages")
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    @Id
    private String id;
    private String roomId;
    private String senderNickname;
    private MessageType type;
    private String content;
    private Instant timestamp;
}