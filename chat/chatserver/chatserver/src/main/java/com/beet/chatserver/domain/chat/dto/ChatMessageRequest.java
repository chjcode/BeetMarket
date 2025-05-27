package com.beet.chatserver.domain.chat.dto;

import com.beet.chatserver.domain.chat.entity.MessageType;

public record ChatMessageRequest(
    Long roomId,
    String receiverNickname,
    MessageType type,
    String content
) { }
