package com.beet.beetmarket.domain.post.mapper;

import com.beet.beetmarket.domain.post.entity.Post;
import com.beet.beetmarket.domain.post.entity.PostDocument;
import com.beet.beetmarket.domain.user.entity.User;

public class PostMapper {
    public static PostDocument toDocument(Post post, long favoriteCount) {
//        String thumbnail = post.getImageUrls().isEmpty()
//                ? null
//                : post.getImageUrls().get(0).getImagePreview();
        String thumbnail = post.getImageUrls().isEmpty()
                ? null
                : post.getImageUrls().get(0).getImageOrigin();

        User author = post.getUser();
        Long buyerId = post.getBuyer() == null ? null : post.getBuyer().getId();

        return PostDocument.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorId(author.getId())
                .authorNickname(author.getNickname())
                .buyerId(buyerId)
                .categoryName(post.getCategory().getName())
                .price(post.getPrice())
                .region(post.getRegion())
                .createdAt(post.getCreatedAt())
                .thumbnailUrl(thumbnail)
                .viewCount(post.getView())
                .favoriteCount(favoriteCount)
                .status(post.getStatus().name())
                .latitude(post.getLatitude())
                .longitude(post.getLongitude())
                .build();
    }
}
