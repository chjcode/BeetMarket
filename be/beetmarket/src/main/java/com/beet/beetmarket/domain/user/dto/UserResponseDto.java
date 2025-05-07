package com.beet.beetmarket.domain.user.dto;

import com.beet.beetmarket.domain.user.entity.GenderType;
import com.beet.beetmarket.domain.user.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserResponseDto(
    String email,
    String nickname,
    @JsonFormat(pattern = "yyyyMMdd")
    String birthDate,
    String gender,
    String profileImage,
    String region,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
    ) {

    public static UserResponseDto from(User user) {
        String nickname = user.getNickname();
        LocalDate birthDate = user.getBirthDate();
        GenderType gender = user.getGender();
        String profileImage = user.getProfileImage();
        String region = user.getRegion();

        return new UserResponseDto(
                user.getEmail(),
                nickname == null ? "" : nickname,
                birthDate == null ? "" : birthDate.toString(),
                gender == null ? "" : gender.toString(),
                profileImage == null ? "" : profileImage,
                region == null ? "" : region,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
