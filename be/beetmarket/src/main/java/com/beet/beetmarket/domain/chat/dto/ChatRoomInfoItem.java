package com.beet.beetmarket.domain.chat.dto;

import java.time.Instant;

public record ChatRoomInfoItem(
    String roomId,
    long unreadMessageCount,
    String opponentUserProfileImageUrl,
    String opponentUserNickname,
    String postFirstImageUrl,
    String lastMessageContent,
    Instant lastMessageTimestamp,
    Long postId
) {}