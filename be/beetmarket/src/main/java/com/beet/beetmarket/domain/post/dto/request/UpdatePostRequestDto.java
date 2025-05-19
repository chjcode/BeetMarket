package com.beet.beetmarket.domain.post.dto.request;

import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdatePostRequestDto(
    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 30, message = "제목은 30자를 넘을 수 없습니다.")
    String title,

    @NotBlank(message = "카테고리는 필수입니다.")
    String category,

    @NotBlank(message = "내용은 필수입니다.")
    String content,

    @NotNull(message = "가격은 필수입니다.") // 가격을 업데이트하려고 한다면, null일 수 없습니다.
    @Max(value = 100000000, message = "가격은 1억원을 초과할 수 없습니다.")
    @Min(value = 0, message = "가격은 0원 이상이어야 합니다.")
    Integer price,

    String region,

    String location,

    List<String> images,

    String video,

    Double latitude,

    Double longitude
) {
}
