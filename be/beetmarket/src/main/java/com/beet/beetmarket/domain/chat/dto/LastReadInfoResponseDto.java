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
            // 읽음 정보가 없는 경우 (한 번도 안 읽었거나, 데이터가 없는 초기 상태)
            // null을 반환하거나, 기본값을 설정할 수 있습니다.
            // 여기서는 null을 반환하여 클라이언트가 해당 필드의 존재 여부로 판단하도록 합니다.
            return null;
        }
        return new LastReadInfoResponseDto(
            chatRoomRead.getUserNickname(),
            chatRoomRead.getLastReadMessageId(),
            chatRoomRead.getLastReadAt()
        );
    }
}