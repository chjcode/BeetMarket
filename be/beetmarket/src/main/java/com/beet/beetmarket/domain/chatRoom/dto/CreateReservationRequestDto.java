package com.beet.beetmarket.domain.chatRoom.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

public record CreateReservationRequestDto(
    @NotNull(message = "예약 시간은 필수입니다.")
    @Future(message = "예약 시간은 현재 시간 이후여야 합니다.")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) // 클라이언트에서 ISO 8601 형식 (예: "2025-12-31T23:59:59")으로 받도록 설정
    LocalDateTime schedule,

    @NotBlank(message = "거래 장소는 필수입니다.")
    String location
) {
}