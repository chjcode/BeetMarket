package com.beet.chatserver.domain.chat.dto;

import java.util.List;

public record ReadAckRequest(
    Long roomId,
    List<String> messageIds
) {}
