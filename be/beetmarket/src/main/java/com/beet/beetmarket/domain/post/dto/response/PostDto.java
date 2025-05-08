package com.beet.beetmarket.domain.post.dto.response;

import com.beet.beetmarket.domain.image.entity.Image;
import com.beet.beetmarket.domain.post.entity.Post;
import com.beet.beetmarket.domain.post.entity.Status;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

public record PostDto (
    String title,
    String content,
    Integer price,
    Status status,
    String region,
    String location,
    LocalDateTime createdAt,
    List<String> images,
    String model3D,
    Long view
) {
    public static PostDto from(Post post) {
        List<String> imageUrls = post
                .getImageUrls()
                .stream()
                .sorted(Comparator.comparingInt(Image::getSequence))
                .map(Image::getImageOrigin)
                .toList();

        return new PostDto(
                post.getTitle(),
                post.getContent(),
                post.getPrice(),
                post.getStatus(),
                post.getRegion(),
                post.getLocation(),
                post.getCreatedAt(),
                imageUrls,
                post.getModel3dUrl(),
                post.getView()
        );
    }
}
