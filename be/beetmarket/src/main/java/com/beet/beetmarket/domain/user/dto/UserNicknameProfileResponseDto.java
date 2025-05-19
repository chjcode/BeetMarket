package com.beet.beetmarket.domain.user.dto;

import com.beet.beetmarket.domain.user.entity.User;

public record UserNicknameProfileResponseDto(
    String nickname,
    String profileImage
) {
    public static UserNicknameProfileResponseDto from(User user) {
        String nickname = user.getNickname();
        String profileImage = user.getProfileImage();

        return new UserNicknameProfileResponseDto(
            nickname == null ? "" : nickname, // nickname이 null이면 빈 문자열 반환
            profileImage == null ? "" : profileImage // profileImage가 null이면 빈 문자열 반환
        );
    }
}