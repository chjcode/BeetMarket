package com.beet.beetmarket.domain.user.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@RedisHash(
    value = "refresh-token",
    timeToLive = 30 * 24 * 60 * 60   // 10시간 TTL (초 단위)
)
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenEntity {

    @Id
    private String nickname; // 사용자 고유 식별자, userId를 어떻게 할 지
    private String refreshToken;

    public void updateToken(String newRefreshToken) {
        this.refreshToken = newRefreshToken;
    }
}