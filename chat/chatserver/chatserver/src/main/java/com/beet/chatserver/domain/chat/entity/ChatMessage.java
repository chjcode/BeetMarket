package com.beet.chatserver.domain.chat.entity;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "chat_messages")
@Builder
@Getter
@Setter
public class ChatMessage {
    @Id
    private String id;
    private String roomId;
    private String senderNickname;
    private MessageType type;
    private String content;
    private Instant timestamp;
    private boolean read;
}
