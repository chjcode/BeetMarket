package com.beet.beetmarket.domain.image.entity;

import com.beet.beetmarket.domain.post.entity.Post;
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
public class Image extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    private String imageOrigin;

    private String imagePreview;

    private Integer sequence;

    @Builder
    public Image(Post post, String imageOrigin, Integer sequence) {
        this.post = post;
        this.imageOrigin = imageOrigin;
        this.imagePreview = imageOrigin;
        this.sequence = sequence;
    }
}
