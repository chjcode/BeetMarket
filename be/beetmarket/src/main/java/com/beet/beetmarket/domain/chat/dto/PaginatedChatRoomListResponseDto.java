package com.beet.beetmarket.domain.chat.dto;

import java.util.List;

public record PaginatedChatRoomListResponseDto(
    List<ChatRoomInfoItem> chatRooms,
    boolean hasNext
) {}