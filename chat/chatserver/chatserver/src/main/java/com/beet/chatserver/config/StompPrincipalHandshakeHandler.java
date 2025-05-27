package com.beet.chatserver.config;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class StompPrincipalHandshakeHandler extends DefaultHandshakeHandler {
    @Override
    protected Principal determineUser(
        ServerHttpRequest req,
        WebSocketHandler handler,
        Map<String,Object> attrs
    ) {
        String nickname = (String) attrs.get("nickname");

        //###
        log.debug("Attempting to determine user. Handshake attributes: {}", attrs); // logger -> log
        if (nickname != null && !nickname.isBlank()) {
            log.info("Successfully determined user for WebSocket session. Nickname: '{}'", nickname); // logger -> log
            return () -> nickname;
        } else {
            log.warn("Could not determine user from handshake attributes (nickname missing or empty). Request URI: {}", req.getURI()); // logger -> log
            return super.determineUser(req, handler, attrs);
        }
        //####

//        return () -> nickname;
    }
}