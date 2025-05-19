package com.beet.beetmarket.domain.chat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GptExtractedScheduleDto {
    @JsonProperty("schedule") // JSON 필드명과 Java 필드명 매핑
    private String scheduleString;

    @JsonProperty("location")
    private String location;
}