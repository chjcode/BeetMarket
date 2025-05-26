package com.beet.beetmarket.domain.chatRoom.dto;

import java.time.Instant;

public record ChatRoomSummaryDto(
    Long roomId,
    Long postId,
    String postTitle,
    String postFirstImageUrl,
    OpponentUserDto opponentUser,
    String lastMessageContent,
    Instant lastMessageTimestamp,
    String lastMessageSenderNickname,
    long unreadMessageCount
) {
    public record OpponentUserDto(
        Long userId,
        String nickname,
        String profileImageUrl
    ) {}
}