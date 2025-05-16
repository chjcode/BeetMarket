package com.beet.beetmarket.domain.post.dto.request;

import java.util.List;

public record UpdatePostRequestDto(
        String title,
        String category,
        String content,
        Integer price,
        String region,
        String location,
        List<String> images,
        String video,
        Double latitude,
        Double longitude
) {
}
