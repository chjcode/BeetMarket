package com.beet.beetmarket.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUserInfoRequestDto(
    @NotBlank(message = "닉네임은 비워둘 수 없습니다.")
    @Size(min = 2, max = 20, message = "닉네임은 2자 이상 20자 이하로 입력해주세요.")
    String nickname,
    @NotBlank(message = "지역 정보는 비워둘 수 없습니다.")
    @Size(min = 1, max = 30, message = "지역 정보는 1자 이상 30자 이하로 입력해주세요.")
    String region,
    String profileImage
) {
}
