package com.beet.beetmarket.domain.user.dto;

import java.time.LocalDateTime;

public record ScheduleResponseDto(
        LocalDateTime schedule,
        String location,
        String buyer,
        String seller
) {

}
