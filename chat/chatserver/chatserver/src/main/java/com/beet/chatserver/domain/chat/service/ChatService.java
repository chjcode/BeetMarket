package com.beet.chatserver.domain.chat.service;

import java.time.Instant;
import java.util.List;
import java.util.Set;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.beet.chatserver.domain.chat.dto.ChatMessageRequest;
import com.beet.chatserver.domain.chat.dto.ChatMessageResponse;
import com.beet.chatserver.domain.chat.dto.ReadAckResponse;
import com.beet.chatserver.domain.chat.entity.ChatMessage;
import com.beet.chatserver.domain.chat.repository.ChatMessageRepository;
//import com.beet.chatserver.domain.chat.pubsub.RedisPublisher;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final RedisTemplate<String, Object> redisTemplate;
//    private final RedisPublisher redisPublisher;

    /* 텍스트·이미지 공통 처리 */
    public void processMessage(ChatMessageRequest req, String senderNickname) {

        // 메시지 저장
        ChatMessage saved = chatMessageRepository.save(
            ChatMessage.builder()
                .roomId(String.valueOf(req.roomId()))
                .senderNickname(senderNickname)
                .type(req.type())
                .content(req.content())
                .timestamp(Instant.now())
                .read(false)
                .build()
        );

        ChatMessageResponse res = new ChatMessageResponse(
            saved.getId(),
            Long.valueOf(saved.getRoomId()),
            senderNickname,
            saved.getType(),
            saved.getContent(),
            saved.getTimestamp(),
            false
        );

        String key = "room:" + req.roomId() + ":participants";
        Boolean inRoom = redisTemplate.opsForSet().isMember(key, req.receiverNickname());


//        Set<Object> participants = redisTemplate.opsForSet().members(key);
//
//        // 3) 보낸 사람 제외하고 각 참가자에게 보내기
//        if (participants != null) {
//            for (Object raw : participants) {
//                String participant = (String) raw;
//                if (!participant.equals(senderNickname)) {
//                    simpMessagingTemplate.convertAndSendToUser(
//                        participant,
//                        "/sub/chat/room/" + req.roomId(),
//                        res
//                    );
//                }
//            }
//        }

        if (inRoom) {
            // 수신자에게만 개별적으로 메시지 전송
            simpMessagingTemplate.convertAndSendToUser(
                req.receiverNickname(),
                "/sub/chat/room/" + saved.getRoomId(),
                res
            );
        }

        // 추후 채팅방에 입장하지 않은 유저 처리 추가(로그인 + 비입장 || 로그아웃)



//        redisPublisher.publish(res);  // 모든 채팅 서버 인스턴스로 fan-out
    }

    /* 읽음 확인 */
    public void markRead(List<String> ids, String readerNickname) {
//        List<ChatMessage> msgs = chatMessageRepository.findAllById(ids);
//        msgs.forEach(m -> m.setRead(true));            // 1:1이므로 단순 bool
//        chatMessageRepository.saveAll(msgs);
//
//        ReadAckResponse ack = new ReadAckResponse(
//            Long.valueOf(msgs.get(0).getChatRoomId()), ids);
//        redisPublisher.publish(ack);
    }
}
