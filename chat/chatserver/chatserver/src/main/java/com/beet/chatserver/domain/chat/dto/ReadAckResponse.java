package com.beet.chatserver.domain.chat.dto;

import java.time.Instant;
import java.util.List;

public record ReadAckResponse(
    Long     roomId,
    String   readerNickname,     // 방을 읽은 사람(b)
    String   lastReadMessageId,
    Instant lastReadAt
) {}
