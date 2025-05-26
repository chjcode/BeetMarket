package com.beet.beetmarket.domain.chat.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL) // null 필드는 JSON 응답에서 제외
public record SuggestedScheduleResponseDto(
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    LocalDateTime suggestedSchedule,
    String suggestedLocation,
    String rawGptResponse, // ChatGPT 원본 응답 (디버깅 또는 클라이언트 추가 정보용)
    String errorMessage // 오류 발생 시 메시지 전달용
) {
    // 성공 시 생성자
    public SuggestedScheduleResponseDto(LocalDateTime schedule, String location, String rawResponse) {
        this(schedule, location, rawResponse, null);
    }

    // 오류 또는 정보 메시지만 있을 경우 생성자
    public SuggestedScheduleResponseDto(String message) {
        this(null, null, null, message);
    }
}