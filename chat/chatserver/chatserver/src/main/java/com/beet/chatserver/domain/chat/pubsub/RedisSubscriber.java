//package com.beet.chatserver.domain.chat.pubsub;
//
//import java.nio.charset.StandardCharsets;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Component;
//import com.beet.chatserver.domain.chat.dto.ChatMessageResponse;
//import com.beet.chatserver.domain.chat.dto.ReadAckResponse;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.databind.SerializationFeature;
//import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
//
//import jakarta.annotation.PostConstruct;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.data.redis.connection.Message;
//
//@Slf4j
//@Component
//@RequiredArgsConstructor
//public class RedisSubscriber {
//
//    private final ObjectMapper mapper;
//    private final SimpMessagingTemplate template;
//
//    @PostConstruct
//    public void setup() {
//        // ensure proper (de)serialization of Java 8 date/time types
//        mapper.registerModule(new JavaTimeModule());
//        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
//    }
//
//    public void onMessage(Message message, byte[] pattern) {
//        try {
//            String raw = new String(message.getBody(), StandardCharsets.UTF_8);
//            if (raw.contains("\"messageIds\"")) {
//                ReadAckResponse ack = mapper.readValue(raw, ReadAckResponse.class);
//                template.convertAndSend("/sub/chat/room/" + ack.roomId() + "/read", ack);
//            } else {
//                ChatMessageResponse chat = mapper.readValue(raw, ChatMessageResponse.class);
//                template.convertAndSend("/sub/chat/room/" + chat.roomId(), chat);
//            }
//        } catch (Exception e) {
//            log.error("Redis subscription processing failed", e);
//        }
//    }
//}