package com.beet.chatserver.global.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;

@Component
public class JwtUtil {
    private final SecretKey secretKey;

    public JwtUtil(@Value("${jwt-secret}") String secret) {
        this.secretKey = new SecretKeySpec(
            secret.getBytes(StandardCharsets.UTF_8),
            Jwts.SIG.HS256.key().build().getAlgorithm()
        );
    }

    public Claims parse(String token) throws SignatureException {
        return Jwts.parser()	// jwt 파서 생성하기 위한 빌더 반환
            .verifyWith(secretKey)	// jwt 서명 검증을 위해 사용될 secretKey 설정(위조확인)
            .build()	// 검증 키를 바탕으로 실제 JWT 파서 생성
            .parseSignedClaims(token) // 전달받은 토큰을 파싱하여 서명이 포함된 클레임 객체 생성
            .getPayload(); // 실제 payload 부분만 추출
    }

    /**
     * payload에 담긴 클레임들 중 key에 해당하는 값 반환
     */
    public String getKey(String token, String key) {
        return parse(token).get(key, String.class);
    }

    public Boolean isExpired(String token) {
        Date expiration = parse(token).getExpiration();
        return expiration.before(new Date());
    }
}
