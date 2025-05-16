package com.beet.beetmarket.domain.user.dto;

import java.time.LocalDateTime;

public record ScheduleResponseDto(
        LocalDateTime schedule,
        String location,
        String tradeType,
        String opposite,
        String postTitle,
        String postThumbnail
) {

}
