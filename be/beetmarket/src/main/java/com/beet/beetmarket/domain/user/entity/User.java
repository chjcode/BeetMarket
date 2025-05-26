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

import java.time.LocalDate;

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

    @Column(unique = true)
    private String oauthName;

    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    private GenderType gender;

    private String profileImage;

    private String oauthProvider;

    private String resign;

    private String resignDate;

    private String region;

    @Builder
    public User(String oauthName, String email, String oauthProvider) {
        this.oauthName = oauthName;
        this.email = email;
        this.oauthProvider = oauthProvider;
    }

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updateAdditionalInfo(LocalDate birthDate, GenderType gender, String region) {
        this.birthDate = birthDate;
        this.gender = gender;
        this.region = region;
    }

    public void updateProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }


}
