package com.beet.chatserver.global.jwt.interceptor;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import com.beet.chatserver.global.jwt.JwtUtil;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean beforeHandshake(
        ServerHttpRequest request,
        ServerHttpResponse response,
        WebSocketHandler wsHandler,
        Map<String, Object> attributes)
    {
        // 쿼리 파라미터에서 access token 추출
        String token = UriComponentsBuilder
            .fromUri(request.getURI())
            .build()
            .getQueryParams()
            .getFirst("access-token");
        // 토큰 없으면 400 Bad handshake – 클라이언트에게 인증 실패 신호
        if (token == null || token.isBlank()) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        // 토큰 검증
        Claims claims = jwtUtil.parse(token);
        // claims.get이부분에서 오류인가? claim 뜯어보기
        // nickname 추출
        String nickname = claims.get("id", String.class);

        if (nickname == null) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        //principal에서 사용하기 위해 인증 성공한 사용자 정보 보관
        attributes.put("nickname", nickname);
        return true;
    }

    @Override
    public void afterHandshake(
        ServerHttpRequest request,
        ServerHttpResponse response,
        WebSocketHandler wsHandler,
        Exception exception) {
        // no-op
    }

}