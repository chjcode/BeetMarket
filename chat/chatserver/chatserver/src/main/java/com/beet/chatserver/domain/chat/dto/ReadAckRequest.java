package com.beet.chatserver.domain.chat.dto;

import java.util.List;

public record ReadAckRequest(
    Long   roomId,               // 방 ID
    String counterpartNickname,  // 읽음 상태를 알려줄 상대(a)
    String lastReadMessageId     // 마지막으로 읽은 메시지 ID
) {}
