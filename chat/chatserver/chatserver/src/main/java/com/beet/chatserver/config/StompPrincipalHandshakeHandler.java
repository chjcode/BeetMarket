package com.beet.chatserver.config;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

@Component
public class StompPrincipalHandshakeHandler extends DefaultHandshakeHandler {
    @Override
    protected Principal determineUser(
        ServerHttpRequest req,
        WebSocketHandler handler,
        Map<String,Object> attrs
    ) {
        String nickname = (String) attrs.get("nickname");

        return () -> nickname;
    }
}