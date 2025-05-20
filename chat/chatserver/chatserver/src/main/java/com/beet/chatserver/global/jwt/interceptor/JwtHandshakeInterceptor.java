package com.beet.chatserver.global.jwt.interceptor;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import com.beet.chatserver.global.jwt.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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
        log.info("Attempting WebSocket handshake from URI: {}", request.getURI()); // logger -> log

        // 쿼리 파라미터에서 access token 추출
        String token = UriComponentsBuilder
            .fromUri(request.getURI())
            .build()
            .getQueryParams()
            .getFirst("access-token");
        // 토큰 없으면 400 Bad handshake – 클라이언트에게 인증 실패 신호
        if (token == null || token.isBlank()) {
            log.warn("WebSocket handshake failed: Access token is missing. URI: {}", request.getURI()); // logger -> log

            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

//        // 토큰 검증
//        Claims claims = jwtUtil.parse(token);
//        // claims.get이부분에서 오류인가? claim 뜯어보기
//        // nickname 추출
//        String nickname = claims.get("id", String.class);
////        String userNickname = claims.get("nickname", String.class);
//
//        if (nickname == null) {
//            log.warn("WebSocket handshake failed: Nickname (from 'id' claim) not found or empty in token. Token claims: {}", claims.toString()); // logger -> log
//
//            response.setStatusCode(HttpStatus.UNAUTHORIZED);
//            return false;
//        }
//
//        log.info("WebSocket handshake successful for nickname: '{}'. Attributes set.", nickname); // logger -> log
//
//        //principal에서 사용하기 위해 인증 성공한 사용자 정보 보관
//        attributes.put("nickname", nickname);
////        attributes.put("userNickname", userNickname);
//        return true;

        try {
            Claims claims = jwtUtil.parse(token);
            String nickname = claims.get("id", String.class);

            if (nickname == null || nickname.isBlank()) {
                log.warn("WebSocket handshake failed: Nickname (from 'id' claim) not found or empty in token. Token claims: {}", claims.toString()); // logger -> log
                response.setStatusCode(HttpStatus.UNAUTHORIZED);
                return false;
            }

            attributes.put("nickname", nickname);
            log.info("WebSocket handshake successful for nickname: '{}'. Attributes set.", nickname); // logger -> log
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("WebSocket handshake failed: JWT token has expired. URI: {}, Token: {}", request.getURI(), token.length() > 10 ? token.substring(0, 10) + "..." : token, e); // logger -> log
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        } catch (UnsupportedJwtException | MalformedJwtException | SignatureException | IllegalArgumentException e) {
            log.warn("WebSocket handshake failed: Invalid JWT token. URI: {}, Token: {}, Error: {}", request.getURI(), token.length() > 10 ? token.substring(0, 10) + "..." : token, e.getMessage()); // logger -> log
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        } catch (Exception e) {
            log.error("WebSocket handshake failed: Unexpected error during token parsing. URI: {}, Token: {}", request.getURI(), token.length() > 10 ? token.substring(0, 10) + "..." : token, e); // logger -> log
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
            return false;
        }
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