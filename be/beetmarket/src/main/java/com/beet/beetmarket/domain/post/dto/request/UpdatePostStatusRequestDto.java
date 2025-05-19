package com.beet.beetmarket.domain.post.dto.request;

import com.beet.beetmarket.domain.post.entity.Status;

public record UpdatePostStatusRequestDto(
        Status status,
        String buyerNickname
) {
}
