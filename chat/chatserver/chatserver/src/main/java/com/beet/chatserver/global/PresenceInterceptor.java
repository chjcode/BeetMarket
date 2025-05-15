package com.beet.chatserver.global;

import java.security.Principal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
public class PresenceInterceptor implements ChannelInterceptor {

    private final RedisTemplate<String, Object> redisTemplate;

    /** sessionId → (subscriptionId → roomId) */
    private final Map<String, Map<String, String>> sessionSubscriptions = new ConcurrentHashMap<>();

    public PresenceInterceptor(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor h = StompHeaderAccessor.wrap(message);
        Principal user = h.getUser();
        if (user == null) {
            return message;      // 비인증 프레임은 무시
        }
        String username  = user.getName();
        String sessionId = h.getSessionId();
        StompCommand cmd = h.getCommand();

        /* ------------- SUBSCRIBE ------------- */
        if (StompCommand.SUBSCRIBE.equals(cmd)) {
            String dest  = h.getDestination();        // 예) "/user/queue/chat/room/42"
            String subId = h.getSubscriptionId();

            // ── 방 토픽 & 개인 큐 둘 다 허용 ─────────────────────────────
            if (dest != null &&
                (dest.startsWith("/sub/chat/room/")) || (dest.startsWith("/user/sub/chat/room/"))) {

                String roomId = dest.substring(dest.lastIndexOf('/') + 1);

                // Redis SADD room:{id}:participants username
                String key = "room:" + roomId + ":participants";
                redisTemplate.opsForSet().add(key, username);

                // 메모리 맵에 기록
                sessionSubscriptions
                    .computeIfAbsent(sessionId, sid -> new ConcurrentHashMap<>())
                    .put(subId, roomId);
            }
        }

        /* ------------- UNSUBSCRIBE ------------- */
        else if (StompCommand.UNSUBSCRIBE.equals(cmd)) {
            String subId = h.getSubscriptionId();
            Map<String,String> subs = sessionSubscriptions.get(sessionId);
            if (subs != null && subs.containsKey(subId)) {
                String roomId = subs.remove(subId);
                String key = "room:" + roomId + ":participants";
                redisTemplate.opsForSet().remove(key, username);
                if (subs.isEmpty()) {
                    sessionSubscriptions.remove(sessionId);
                }
            }
        }

        /* ------------- DISCONNECT ------------- */
        else if (StompCommand.DISCONNECT.equals(cmd)) {
            Map<String,String> subs = sessionSubscriptions.remove(sessionId);
            if (subs != null) {
                subs.values().forEach(roomId -> {
                    String key = "room:" + roomId + ":participants";
                    redisTemplate.opsForSet().remove(key, username);
                });
            }
        }

        return message;
    }

    /** 외부에서 세션 구독 정보를 꺼낼 때 사용 */
    public Map<String,String> removeSessionSubscriptions(String sessionId) {
        return sessionSubscriptions.remove(sessionId);
    }
}