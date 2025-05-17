package com.beet.beetmarket.domain.chat.dto;


import org.springframework.data.domain.Page;

public record PaginatedChatMessagesResponseDto(
    Page<ChatMessageResponseDto> messages,
    LastReadInfoResponseDto currentUserLastReadInfo,
    LastReadInfoResponseDto opponentLastReadInfo // 상대방 마지막 읽음 정보 추가
) {}