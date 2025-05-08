package com.beet.beetmarket.domain.post.dto.request;

import java.util.List;

public record CreatePostRequestDto(
        String title,
        String category,
        String content,
        Integer price,
        String region,
        String location,
        List<String> images,
        String video,
        String uuid
) {
}
