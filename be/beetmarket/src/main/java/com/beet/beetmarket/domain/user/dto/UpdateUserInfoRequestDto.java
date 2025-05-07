package com.beet.beetmarket.domain.user.dto;

public record UpdateUserInfoRequestDto(
    String nickname,
    String region,
    String profileImage
) {
}
