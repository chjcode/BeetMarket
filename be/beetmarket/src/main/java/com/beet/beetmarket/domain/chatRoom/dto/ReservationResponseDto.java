package com.beet.beetmarket.domain.chatRoom.dto;

import java.time.LocalDateTime;

public record ReservationResponseDto(
    Long chatRoomId,
    LocalDateTime schedule,
    String location
) {
    public static ReservationResponseDto success(Long chatRoomId, LocalDateTime schedule, String location) {
        return new ReservationResponseDto(chatRoomId, schedule, location);
    }
}