package com.beet.chatserver.config;


import org.springframework.boot.autoconfigure.websocket.servlet.WebSocketMessagingAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

import com.beet.chatserver.global.PresenceInterceptor;
import com.beet.chatserver.global.jwt.interceptor.JwtHandshakeInterceptor;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompPrincipalHandshakeHandler principalHandshakeHandler;
    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;
    private final PresenceInterceptor presenceInterceptor;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat")
            // jwt 검증 인터셉터 등록
            .addInterceptors(jwtHandshakeInterceptor)
            // handshake 성공 후 principal 생성 핸들러 설정
            .setHandshakeHandler(principalHandshakeHandler)
            // CORS, SockJS 설정
            .setAllowedOriginPatterns("*")
            .setAllowedOrigins("https://k12a307.p.ssafy.io")
            .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/pub");
        registry.enableSimpleBroker("/sub");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // 구독/해제/연결 종료 이벤트 가로채기
        registration.interceptors(presenceInterceptor);
    }
}
