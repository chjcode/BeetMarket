package com.beet.beetmarket.domain.post.entity;

import com.beet.beetmarket.domain.category.entity.Category;
import com.beet.beetmarket.domain.image.entity.Image;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.global.jpa.base.BaseTimeEntity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    private String title;

    private String content;

    private Integer price;

    private Status status;

    private String region;

    private String location;

    private String videoUrl;

    private String model3dUrl;

    @OneToMany(
        mappedBy = "post",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @OrderBy("sequence ASC")
    private List<Image> imageUrls = new ArrayList<>();


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id")
    private User buyer;

    private Long view;

    // bucket에서 경로 구분을 위한 post uuid
    private String uuid;

    // 지도 표시를 위해 추가됨
    private Double latitude;
    private Double longitude;

    @Builder
    public Post(User user, Category category, String title, String content, Integer price,
                Status status, String region, String location,
                String videoUrl, String model3dUrl, List<Image> imageUrls, String uuid,
                Double latitude, Double longitude) {
        this.user = user;
        this.category = category;
        this.title = title;
        this.content = content;
        this.price = price;
        this.status = status;
        this.region = region;
        this.location = location;
        this.videoUrl = videoUrl;
        this.model3dUrl = model3dUrl;
        this.imageUrls = imageUrls;
        this.view = 0L;
        this.uuid = uuid;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public void updatePost(Category category, String title, String content, Integer price,
                           String region, String location, String videoUrl,
                           List<Image> newImages,
                           Double latitude, Double longitude) {
        this.category = category;
        this.title = title;
        this.content = content;
        this.price = price;
        this.region = region;
        this.location = location;
        this.videoUrl = videoUrl;
        this.imageUrls.clear();
        this.imageUrls.addAll(newImages);
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public void viewPost() {
        this.view++;
    }

    public void reserve() {
        this.status = Status.RESERVED;
    }

    public void cancel() {
        this.status = Status.AVAILABLE;
    }

    public void complete(User buyer) {
        this.status = Status.COMPLETED;
        this.buyer = buyer;
    }
}
