package com.beet.beetmarket.domain.post.dto.response;

import com.beet.beetmarket.domain.post.entity.PostDocument;
import com.beet.beetmarket.domain.post.entity.Status;

import java.time.LocalDateTime;

public record PostListDto(
        Long id,
        Status status,
        String title,
        String categoryName,
        Integer price,
        String region,
        LocalDateTime createdAt,
        String thumbnailUrl,
        Long viewCount,
        Long favoriteCount,
        String authorNickname,
        Boolean isLiked
) {
    public static PostListDto from(PostDocument postDocument, boolean liked) {
        return new PostListDto(
                postDocument.getId(),
                Status.valueOf(postDocument.getStatus()),
                postDocument.getTitle(),
                postDocument.getCategoryName(),
                postDocument.getPrice(),
                postDocument.getRegion(),
                postDocument.getCreatedAt(),
                postDocument.getThumbnailUrl(),
                postDocument.getViewCount(),
                postDocument.getFavoriteCount(),
                postDocument.getAuthorNickname(),
                liked
        );
    }
}
