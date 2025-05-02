package com.beet.beetmarket.domain.chatRoom.entity;


import com.beet.beetmarket.domain.post.entity.Post;
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
public class ChatRoom extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String schedule;

    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id")
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    private String lastMessageAt;

    @Builder
    public ChatRoom(User seller, User buyer, Post post) {
        this.seller = seller;
        this.buyer = buyer;
        this.post = post;
    }

    public void updateLocation(String location) {
        this.location = location;
    }

    public void updateSchedule(String schedule) {
        this.schedule = schedule;
    }

    public void updateLastMessageAt(String lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }
}