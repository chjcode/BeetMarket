//package com.beet.chatserver.domain.chat.pubsub;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.listener.ChannelTopic;
//import org.springframework.stereotype.Component;
//
//@Component
//@RequiredArgsConstructor
//public class RedisPublisher {
//
//    private final RedisTemplate<String, Object> redisTemplate;
//    private final ChannelTopic chatTopic;
//
//    public void publish(Object message) {
//        redisTemplate.convertAndSend(chatTopic.getTopic(), message);
//    }
//}
