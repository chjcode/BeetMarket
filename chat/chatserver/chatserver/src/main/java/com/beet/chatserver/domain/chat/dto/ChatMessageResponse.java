package com.beet.chatserver.domain.chat.dto;

import java.time.Instant;

import com.beet.chatserver.domain.chat.entity.ChatMessage;
import com.beet.chatserver.domain.chat.entity.MessageType;

public record ChatMessageResponse(
    String id,
    Long roomId,
    String senderNickname,
    MessageType type,
    String content,
    Instant timestamp
) {
    public static ChatMessageResponse fromEntity(ChatMessage entity, String receiverNickname) {
        return new ChatMessageResponse(
            entity.getId(),
            Long.valueOf(entity.getRoomId()),
            entity.getSenderNickname(),
            entity.getType(),
            entity.getContent(),
            entity.getTimestamp()
        );
    }
}
