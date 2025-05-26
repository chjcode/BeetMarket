package com.beet.beetmarket.domain.chat.dto;

import com.beet.beetmarket.domain.chat.entity.ChatMessage;
import com.beet.beetmarket.domain.chat.entity.MessageType;
import java.time.Instant;

public record ChatMessageResponseDto(
    String id,
    String roomId,
    String senderNickname,
    MessageType type,
    String content,
    Instant timestamp
) {
    public static ChatMessageResponseDto fromEntity(ChatMessage chatMessage) {
        return new ChatMessageResponseDto(
            chatMessage.getId(),
            chatMessage.getRoomId(),
            chatMessage.getSenderNickname(),
            chatMessage.getType(),
            chatMessage.getContent(),
            chatMessage.getTimestamp()
        );
    }
}