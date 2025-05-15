package com.beet.chatserver.domain.chat.dto;

import java.time.Instant;

import com.beet.chatserver.domain.chat.entity.MessageType;

public record ChatMessageResponse(
    String id,
    Long roomId,
    String senderNickname,
    MessageType type,
    String content,
    Instant timestamp,
    boolean read
) {}
