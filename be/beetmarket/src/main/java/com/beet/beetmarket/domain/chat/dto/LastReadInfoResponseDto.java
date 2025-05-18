package com.beet.beetmarket.domain.chat.dto;

import com.beet.beetmarket.domain.chat.entity.ChatRoomRead;
import java.time.Instant;

public record LastReadInfoResponseDto(
    String userNickname,
    String lastReadMessageId,
    Instant lastReadAt
) {
    public static LastReadInfoResponseDto fromEntity(ChatRoomRead chatRoomRead) {
        if (chatRoomRead == null) {
            // 읽음 정보가 없는 경우 (한 번도 안 읽은 경우)
            // null을 반환하여 클라이언트가 해당 필드의 존재 여부로 판단하도록 함.
            return null;
        }
        return new LastReadInfoResponseDto(
            chatRoomRead.getUserNickname(),
            chatRoomRead.getLastReadMessageId(),
            chatRoomRead.getLastReadAt()
        );
    }
}