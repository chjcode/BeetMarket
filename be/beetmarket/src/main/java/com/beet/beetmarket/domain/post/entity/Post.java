package com.beet.beetmarket.domain.post.entity;

import com.beet.beetmarket.domain.category.entity.Category;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.global.jpa.base.BaseTimeEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    private String status;

    private String region;

    private String location;

    private String videoUrl;

    private String model3dUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id")
    private User buyer;

    private Long view;

    @Builder
    public Post(User user, Category category, String title, String content, Integer price,
                String status, String region, String location,
                String videoUrl, String model3dUrl, User buyer, Long view) {
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
        this.buyer = buyer;
        this.view = view;
    }
}
