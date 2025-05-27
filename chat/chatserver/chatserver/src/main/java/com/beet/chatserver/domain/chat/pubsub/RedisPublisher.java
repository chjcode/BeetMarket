package com.beet.chatserver.domain.chat.pubsub;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisPublisher {

    private final RedisTemplate<String, Object> redisTemplate;
//    private final ChannelTopic chatTopic;

    public void publish(Long roomId, Object message) {
        // 채널 이름 형식: chat.room.{roomId}
        String channel = "chat.room." + roomId;
        try {
            // RedisTemplate이 JacksonSerializer를 사용하므로 객체를 그대로 publish 가능
            redisTemplate.convertAndSend(channel, message);
            log.debug("Published message to Redis channel '{}': {}", channel, message);
        } catch (Exception e) {
            log.error("Failed to publish message to Redis channel '{}': {}", channel, message, e);
        }
    }

//    public void publish(Object message) {
//        redisTemplate.convertAndSend(chatTopic.getTopic(), message);
//    }
}
