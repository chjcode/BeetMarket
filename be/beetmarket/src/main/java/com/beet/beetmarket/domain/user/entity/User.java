package com.beet.beetmarket.domain.user.entity;

import com.beet.beetmarket.global.jpa.base.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String nickname;

    private String birthDate;

    @Enumerated(EnumType.STRING)
    private GenderType gender;

    private String profileImage;

    private String oauthProvider;

    private String resign;

    private String resignDate;

    private String region;

    @Builder
    public User(String email, String oauthProvider) {
        this.email = email;
        this.oauthProvider = oauthProvider;
    }

    public void updateAdditionalInfo(String nickname, String birthDate, GenderType gender, String region) {
        this.nickname = nickname;
        this.birthDate = birthDate;
        this.gender = gender;
        this.region = region;
    }
}
