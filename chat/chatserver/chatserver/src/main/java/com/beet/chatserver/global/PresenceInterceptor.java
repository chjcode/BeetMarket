//package com.beet.chatserver.global;
//
//import java.security.Principal;
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.messaging.Message;
//import org.springframework.messaging.MessageChannel;
//import org.springframework.messaging.simp.stomp.StompCommand;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.messaging.support.ChannelInterceptor;
//import org.springframework.stereotype.Component;
//
//@Component
//public class PresenceInterceptor implements ChannelInterceptor {
//
//    private final RedisTemplate<String, Object> redisTemplate;
//
//    /** sessionId → (subscriptionId → roomId) */
//    private final Map<String, Map<String, String>> sessionSubscriptions = new ConcurrentHashMap<>();
//
//    public PresenceInterceptor(RedisTemplate<String, Object> redisTemplate) {
//        this.redisTemplate = redisTemplate;
//    }
//
//    @Override
//    public Message<?> preSend(Message<?> message, MessageChannel channel) {
//        StompHeaderAccessor h = StompHeaderAccessor.wrap(message);
//        Principal user = h.getUser();
//        if (user == null) {
//            return message;      // 비인증 프레임은 무시
//        }
//        String username  = user.getName();
//        String sessionId = h.getSessionId();
//        StompCommand cmd = h.getCommand();
//
//        /* ------------- SUBSCRIBE ------------- */
//        if (StompCommand.SUBSCRIBE.equals(cmd)) {
//            String dest  = h.getDestination();        // 예) "/user/queue/chat/room/42"
//            String subId = h.getSubscriptionId();
//
//            // ── 방 토픽 & 개인 큐 둘 다 허용 ─────────────────────────────
//            if (dest != null &&
//                (dest.startsWith("/sub/chat/room/")) || (dest.startsWith("/user/sub/chat/room/"))) {
//
//                String roomId = dest.substring(dest.lastIndexOf('/') + 1);
//
//                // Redis SADD room:{id}:participants username
//                String key = "room:" + roomId + ":participants";
//                redisTemplate.opsForSet().add(key, username);
//
//                // 메모리 맵에 기록
//                sessionSubscriptions
//                    .computeIfAbsent(sessionId, sid -> new ConcurrentHashMap<>())
//                    .put(subId, roomId);
//            }
//        }
//
//        /* ------------- UNSUBSCRIBE ------------- */
//        else if (StompCommand.UNSUBSCRIBE.equals(cmd)) {
//            String subId = h.getSubscriptionId();
//            Map<String,String> subs = sessionSubscriptions.get(sessionId);
//            if (subs != null && subs.containsKey(subId)) {
//                String roomId = subs.remove(subId);
//                String key = "room:" + roomId + ":participants";
//                redisTemplate.opsForSet().remove(key, username);
//                if (subs.isEmpty()) {
//                    sessionSubscriptions.remove(sessionId);
//                }
//            }
//        }
//
//        /* ------------- DISCONNECT ------------- */
//        else if (StompCommand.DISCONNECT.equals(cmd)) {
//            Map<String,String> subs = sessionSubscriptions.remove(sessionId);
//            if (subs != null) {
//                subs.values().forEach(roomId -> {
//                    String key = "room:" + roomId + ":participants";
//                    redisTemplate.opsForSet().remove(key, username);
//                });
//            }
//        }
//
//        return message;
//    }
//
//    /** 외부에서 세션 구독 정보를 꺼낼 때 사용 */
//    public Map<String,String> removeSessionSubscriptions(String sessionId) {
//        return sessionSubscriptions.remove(sessionId);
//    }
//}

package com.beet.chatserver.global;

import java.security.Principal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// import org.slf4j.Logger; // @Slf4j 사용 시 직접 임포트 필요 없음
// import org.slf4j.LoggerFactory; // @Slf4j 사용 시 직접 임포트 필요 없음
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j; // @Slf4j 어노테이션 임포트

@Slf4j // Lombok 어노테이션 추가
@Component
public class PresenceInterceptor implements ChannelInterceptor {

    // private static final Logger logger = LoggerFactory.getLogger(PresenceInterceptor.class); // @Slf4j가 자동으로 생성
    private final RedisTemplate<String, Object> redisTemplate;
    private final Map<String, Map<String, String>> sessionSubscriptions = new ConcurrentHashMap<>();

    public PresenceInterceptor(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        StompCommand command = accessor.getCommand();
        String sessionId = accessor.getSessionId();
        Principal user = accessor.getUser();
        String username = (user != null) ? user.getName() : "anonymous";

        log.debug("STOMP Inbound. Command: [{}], SessionId: [{}], User: [{}], Headers: {}",
            command, sessionId, username, accessor.toNativeHeaderMap()); // logger -> log

        if (command == null) {
            log.warn("Received message with null STOMP command. SessionId: [{}], User: [{}]", sessionId, username); // logger -> log
            return message;
        }

        if (user == null && command != StompCommand.CONNECT && command != StompCommand.STOMP) {
            log.warn("STOMP Command [{}] received without authenticated user. SessionId: [{}]. Message might be rejected by further processing if authentication is required.", command, sessionId); // logger -> log
        }

        switch (command) {
            case CONNECT:
                String connectNickname = (String) accessor.getSessionAttributes().get("nickname");
                log.info("STOMP CONNECT received. SessionId: [{}], Login Header: [{}], Passcode Header: [{}], Nickname from session attributes: [{}]",
                    sessionId, accessor.getLogin(), (accessor.getPasscode() != null ? "******" : "null"), connectNickname); // logger -> log
                break;

            case SUBSCRIBE:
                String destination = accessor.getDestination();
                String subscriptionId = accessor.getSubscriptionId();
                log.info("STOMP SUBSCRIBE received. SessionId: [{}], User: [{}], Destination: [{}], SubscriptionId: [{}]",
                    sessionId, username, destination, subscriptionId); // logger -> log

                if (destination != null &&
                    (destination.startsWith("/sub/chat/room/") || destination.startsWith("/user/sub/chat/room/"))) {
                    String roomId = destination.substring(destination.lastIndexOf('/') + 1);
                    try {
                        String key = "room:" + roomId + ":participants";
                        redisTemplate.opsForSet().add(key, username);
                        sessionSubscriptions
                            .computeIfAbsent(sessionId, sid -> new ConcurrentHashMap<>())
                            .put(subscriptionId, roomId);
                        log.info("User '{}' successfully subscribed to room '{}'. SessionId: [{}], SubscriptionId: [{}]",
                            username, roomId, sessionId, subscriptionId); // logger -> log
                    } catch (Exception e) {
                        log.error("Error during SUBSCRIBE processing for User: '{}', Room: '{}'. SessionId: [{}], SubscriptionId: [{}]. Error: {}",
                            username, roomId, sessionId, subscriptionId, e.getMessage(), e); // logger -> log
                    }
                } else {
                    log.warn("User '{}' attempted to subscribe to an unhandled or malformed destination: [{}]. SessionId: [{}]",
                        username, destination, sessionId); // logger -> log
                }
                break;

            case UNSUBSCRIBE:
                String unsubSubscriptionId = accessor.getSubscriptionId();
                log.info("STOMP UNSUBSCRIBE received. SessionId: [{}], User: [{}], SubscriptionId: [{}]",
                    sessionId, username, unsubSubscriptionId); // logger -> log
                Map<String,String> subs = sessionSubscriptions.get(sessionId);
                if (subs != null && subs.containsKey(unsubSubscriptionId)) {
                    String roomId = subs.remove(unsubSubscriptionId);
                    try {
                        String key = "room:" + roomId + ":participants";
                        redisTemplate.opsForSet().remove(key, username);
                        log.info("User '{}' successfully unsubscribed from room '{}'. SessionId: [{}], SubscriptionId: [{}]",
                            username, roomId, sessionId, unsubSubscriptionId); // logger -> log
                        if (subs.isEmpty()) {
                            sessionSubscriptions.remove(sessionId);
                            log.debug("Removed empty subscription map for SessionId: [{}]", sessionId); // logger -> log
                        }
                    } catch (Exception e) {
                        log.error("Error during UNSUBSCRIBE processing for User: '{}', Room: '{}'. SessionId: [{}], SubscriptionId: [{}]. Error: {}",
                            username, roomId, sessionId, unsubSubscriptionId, e.getMessage(), e); // logger -> log
                    }
                } else {
                    log.warn("UNSUBSCRIBE received for unknown or already removed subscription. SessionId: [{}], User: [{}], SubscriptionId: [{}]",
                        sessionId, username, unsubSubscriptionId); // logger -> log
                }
                break;

            case DISCONNECT:
                log.info("STOMP DISCONNECT received. SessionId: [{}], User: [{}]", sessionId, username); // logger -> log
                Map<String,String> disconnectSubs = sessionSubscriptions.remove(sessionId);
                if (disconnectSubs != null) {
                    log.info("Processing DISCONNECT for User: '{}', SessionId: [{}]. Removing {} subscriptions.",
                        username, sessionId, disconnectSubs.size()); // logger -> log
                    disconnectSubs.forEach((subId, roomId) -> {
                        try {
                            String key = "room:" + roomId + ":participants";
                            redisTemplate.opsForSet().remove(key, username);
                            log.info("User '{}' removed from room '{}' due to disconnect. SessionId: [{}]",
                                username, roomId, sessionId); // logger -> log
                        } catch (Exception e) {
                            log.error("Error removing User: '{}' from Room: '{}' during disconnect. SessionId: [{}]. Error: {}",
                                username, roomId, sessionId, e.getMessage(), e); // logger -> log
                        }
                    });
                } else {
                    log.info("DISCONNECT received for SessionId: [{}] with no active subscriptions in this interceptor's map. User: [{}]", sessionId, username); // logger -> log
                }
                break;

            case SEND:
                log.info("STOMP SEND received. SessionId: [{}], User: [{}], Destination: [{}]",
                    sessionId, username, accessor.getDestination()); // logger -> log
                break;

            case MESSAGE:
                log.debug("STOMP MESSAGE (inbound) received. SessionId: [{}], User: [{}], Destination: [{}]",
                    sessionId, username, accessor.getDestination()); // logger -> log
                break;

            default:
                log.debug("Unhandled STOMP Command: [{}] received. SessionId: [{}], User: [{}]",
                    command, sessionId, username); // logger -> log
                break;
        }
        return message;
    }

    @Override
    public void afterSendCompletion(Message<?> message, MessageChannel channel, boolean sent, Exception ex) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        String sessionId = accessor.getSessionId();
        StompCommand command = accessor.getCommand();
        Principal user = accessor.getUser();
        String username = (user != null) ? user.getName() : (String) accessor.getSessionAttributes().get("nickname");
        if (username == null) username = "anonymous";

        if (ex != null) {
            log.error("Failed to send STOMP message to broker channel. Command: [{}], SessionId: [{}], User: [{}]. Exception: {}",
                command, sessionId, username, ex.getMessage(), ex); // logger -> log
        } else if (!sent) {
            log.warn("STOMP message was not sent to broker channel (no specific exception, possibly filtered). Command: [{}], SessionId: [{}], User: [{}]",
                command, sessionId, username); // logger -> log
        } else {
            if (command != null && command != StompCommand.CONNECT && command != StompCommand.CONNECTED) {
                log.debug("Successfully processed and sent STOMP message to broker channel. Command: [{}], SessionId: [{}], User: [{}]",
                    command, sessionId, username); // logger -> log
            }
        }
    }

    public Map<String,String> removeSessionSubscriptions(String sessionId) {
        return sessionSubscriptions.remove(sessionId);
    }
}