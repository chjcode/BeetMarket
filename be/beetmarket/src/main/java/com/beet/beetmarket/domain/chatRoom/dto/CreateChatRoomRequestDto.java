package com.beet.beetmarket.domain.chatRoom.dto;

import jakarta.validation.constraints.NotNull;

public record CreateChatRoomRequestDto(
    @NotNull(message = "게시글 ID는 필수입니다.")
    Long postId
) {
}
