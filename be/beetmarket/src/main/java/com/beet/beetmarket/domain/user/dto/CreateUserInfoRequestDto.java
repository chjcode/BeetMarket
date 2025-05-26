package com.beet.beetmarket.domain.user.dto;

import com.beet.beetmarket.domain.user.entity.GenderType;

import java.time.LocalDate;

public record CreateUserInfoRequestDto(
        String nickname,
        LocalDate birthDate,
        GenderType gender,
        String region
) {
}
