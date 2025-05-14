package com.beet.beetmarket.domain.post.dto.response;

import com.beet.beetmarket.domain.post.entity.Post;
import com.beet.beetmarket.domain.post.entity.Status;
import com.beet.beetmarket.domain.user.entity.User;

import java.time.LocalDateTime;
import java.util.List;

public record PostDto (
    String title,
    String content,
    String sellerNickname,
    String sellerProfileImage,
    String sellerRegion,
    String category,
    Integer price,
    Status status,
    String region,
    String location,
    LocalDateTime createdAt,
    List<String> images,
    String model3D,
    Long view,
    Long like,
    Boolean isLiked
) {
    public static PostDto from(Post post, List<String> imageUrls, Long likes, Boolean isLiked) {
        User seller = post.getUser();
        String category = post.getCategory().getName();

        return new PostDto(
                post.getTitle(),
                post.getContent(),
                seller.getNickname(),
                seller.getProfileImage(),
                seller.getRegion(),
                category,
                post.getPrice(),
                post.getStatus(),
                post.getRegion(),
                post.getLocation(),
                post.getCreatedAt(),
                imageUrls,
                post.getModel3dUrl(),
                post.getView(),
                likes,
                isLiked
        );
    }
}
