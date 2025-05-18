package com.beet.beetmarket.domain.chat.dto;

import com.beet.beetmarket.domain.chatRoom.entity.ChatRoom;
import lombok.Getter;

public record ChatRoomWithFirstImageDto(
    ChatRoom chatRoom,
    String firstImagePreview
) {}