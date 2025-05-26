package com.beet.beetmarket.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OpenAiChatRequestDto {
    private String model;
    private List<OpenAiChatMessageDto> messages;
    private Double temperature;
    private Integer max_tokens;
}