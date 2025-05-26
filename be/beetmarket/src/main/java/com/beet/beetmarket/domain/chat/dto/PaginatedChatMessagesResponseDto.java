package com.beet.beetmarket.domain.chat.dto;


import org.springframework.data.domain.Page;

public record PaginatedChatMessagesResponseDto(
    Page<ChatMessageResponseDto> messages,
    //사용자의 마지막 읽음 정보
    LastReadInfoResponseDto currentUserLastReadInfo,
    // 상대방 마지막 읽음 정보
    LastReadInfoResponseDto opponentLastReadInfo
) {}