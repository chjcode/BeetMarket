package com.beet.chatserver.domain.chat.pubsub;

import java.nio.charset.StandardCharsets;

import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import com.beet.chatserver.domain.chat.dto.ChatMessageResponse;
import com.beet.chatserver.domain.chat.dto.ReadAckResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisSubscriber implements MessageListener {

    private final ObjectMapper objectMapper; // RedisConfig에서 생성된 Bean 주입
    private final SimpMessagingTemplate template;

    /**
     * Redis 채널에서 메시지를 수신했을 때 호출됩니다.
     * @param message 수신된 메시지 (본문 + 채널 정보)
     * @param pattern 구독에 사용된 패턴 (여기서는 사용하지 않음)
     */
    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            // 메시지 본문을 객체로 역직렬화
            Object receivedObject = objectMapper.readValue(message.getBody(), Object.class);

            // 채널 이름에서 roomId 추출 (e.g., chat.room.123 -> 123)
            String channel = new String(message.getChannel());
            String roomId = channel.substring(channel.lastIndexOf('.') + 1);
            log.debug("Received message from Redis channel '{}'", channel);

            // 메시지 타입에 따라 처리 분기
            if (receivedObject instanceof ChatMessageResponse chat) {
                log.debug("Processing ChatMessageResponse for room {}: {}", chat.roomId(), chat.content());
                // 해당 roomId를 구독 중인 로컬 클라이언트에게 메시지 전송
                template.convertAndSend("/sub/chat/room/" + chat.roomId(), chat);


            } else if (receivedObject instanceof ReadAckResponse ack) {
                log.debug("Processing ReadAckResponse for room {}: {}", ack.roomId(), ack.readerNickname());
                // 해당 roomId의 읽음 확인을 구독 중인 로컬 클라이언트에게 전송
                template.convertAndSend("/sub/chat/read/" + ack.roomId(), ack);

            } else {
                log.warn("Received unknown message type or failed direct cast from Redis. Channel: {}, Payload: {}", channel, new String(message.getBody()));
            }

        } catch (Exception e) {
            log.error("Error processing message from Redis subscription. Pattern: {}, Message: {}",
                    (pattern != null ? new String(pattern) : "N/A"),
                    new String(message.getBody()),
                    e);
        }
    }
}