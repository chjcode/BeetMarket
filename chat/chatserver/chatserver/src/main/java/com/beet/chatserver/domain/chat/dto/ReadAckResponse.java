package com.beet.chatserver.domain.chat.dto;

import java.util.List;

public record ReadAckResponse(
    Long roomId,
    List<String> messageIds
) {}
