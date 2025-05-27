package com.beet.chatserver.domain.chat.service;

import java.time.Instant;
import java.util.Set;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 추가

import com.beet.chatserver.domain.chat.dto.ChatMessageRequest;
import com.beet.chatserver.domain.chat.dto.ChatMessageResponse;
import com.beet.chatserver.domain.chat.dto.ReadAckRequest;
import com.beet.chatserver.domain.chat.dto.ReadAckResponse;
import com.beet.chatserver.domain.chat.entity.ChatMessage;
import com.beet.chatserver.domain.chat.entity.ChatRoomRead;
import com.beet.chatserver.domain.chat.entity.MessageType; // MessageType enum이 있다고 가정
import com.beet.chatserver.domain.chat.pubsub.RedisPublisher;
import com.beet.chatserver.domain.chat.repository.ChatMessageRepository;
import com.beet.chatserver.domain.chat.repository.ChatRoomReadRepository;
import com.beet.chatserver.domain.notification.service.NotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChatRoomReadRepository chatRoomReadRepository;
    private final NotificationService notificationService;
    private final RedisPublisher redisPublisher;

    @Transactional
    public void processMessage(ChatMessageRequest req, String senderNickname) {
        log.info("Processing message from {} in room {}: {}", senderNickname, req.roomId(), req.content());

        // 메시지 저장
        ChatMessage savedMessage = chatMessageRepository.save(
                ChatMessage.builder()
                        .roomId(String.valueOf(req.roomId()))
                        .senderNickname(senderNickname)
                        .type(req.type())
                        .content(req.content())
                        .timestamp(Instant.now())
                        .build()
        );

        ChatMessageResponse messageResponse = ChatMessageResponse.fromEntity(savedMessage, req.receiverNickname());

        // Redis Pub/Sub 채널에 메시지 publish
        redisPublisher.publish(req.roomId(), messageResponse);

        // 송신자 읽음 상태 업데이트
        updateUserReadCursor(String.valueOf(req.roomId()), senderNickname, savedMessage.getId(), savedMessage.getTimestamp());

        // #####채팅 서버 확장 시 알림 로직은 별도의 알림 서버로 분리 할 예정#####
        String participantsKey = "chat:room:" + req.roomId() + ":users"; // 키 이름 변경
        Set<Object> participants = redisTemplate.opsForSet().members(participantsKey);

        boolean receiverIsPresent = participants != null && participants.contains(req.receiverNickname());

        // 수신자가 접속하지 않은 경우
        if (!receiverIsPresent) {
            String messagePreview = req.content();
            if (messagePreview.length() > 50) {
                messagePreview = messagePreview.substring(0, 47) + "...";
            }
            notificationService.createAndSendChatMessageNotification(
                    req.receiverNickname(),
                    senderNickname,
                    req.roomId(),
                    savedMessage.getId(),
                    messagePreview
            );
        }
        //################################################################

    }

    @Transactional
    public void markRead(ReadAckRequest req, String readerNickname) {
        Instant readAt = Instant.now();
        // 읽은 사용자의 ChatRoomRead 정보 업데이트
        updateUserReadCursor(String.valueOf(req.roomId()), readerNickname, req.lastReadMessageId(), readAt);

        // 읽음 ACK 응답 페이로드 생성
        ReadAckResponse readAckResponse = new ReadAckResponse(
            req.roomId(),
            readerNickname,         // 이 메시지(들)을 읽은 사람 (B)
            req.lastReadMessageId(),// 어디까지 읽었는지
            readAt                  // 읽은 시간
        );

        // 읽음 ACK를 Redis로 발행 -> RedisSubscriber가 받아서 모든 서버의 관련자에게 전달
        redisPublisher.publish(req.roomId(), readAckResponse);
    }

    // 공통 로직: 사용자의 특정 방에 대한 마지막 읽은 메시지 ID와 시간 업데이트
    private void updateUserReadCursor(String roomId, String userNickname, String lastReadMessageId, Instant lastReadAt) {
        ChatRoomRead chatRoomRead = chatRoomReadRepository
            .findByRoomIdAndUserNickname(roomId, userNickname)
            .orElseGet(() -> {
                log.info("Creating new ChatRoomRead entry for user {} in room {}", userNickname, roomId);
                return ChatRoomRead.builder()
                    .roomId(roomId)
                    .userNickname(userNickname)
                    .build();
            });

        // 최신 메시지로만 업데이트 (이전 시간의 읽음 표시는 무시)
        if (chatRoomRead.getLastReadAt() == null || lastReadAt.isAfter(chatRoomRead.getLastReadAt())) {
            chatRoomRead.setLastReadMessageId(lastReadMessageId);
            chatRoomRead.setLastReadAt(lastReadAt);
            chatRoomReadRepository.save(chatRoomRead);
            log.debug("Updated read cursor for user {} in room {} to messageId {} at {}", userNickname, roomId, lastReadMessageId, lastReadAt);
        } else {
            log.debug("Skipped updating read cursor for user {} in room {}. Current read at {} is later than new read at {}.",
                userNickname, roomId, chatRoomRead.getLastReadAt(), lastReadAt);
        }
    }



    // 단일 서버 && STOMP 사용 로직
//    @Transactional
//    public void processMessage(ChatMessageRequest req, String senderNickname) {
//        log.info("Processing message from {} in room {}: {}", senderNickname, req.roomId(), req.content());
//
//        // 메시지 저장
//        ChatMessage savedMessage = chatMessageRepository.save(
//            ChatMessage.builder()
//                .roomId(String.valueOf(req.roomId()))
//                .senderNickname(senderNickname)
//                .type(req.type())
//                .content(req.content())
//                .timestamp(Instant.now())
//                .build()
//        );
//
//        ChatMessageResponse messageResponse = ChatMessageResponse.fromEntity(savedMessage, req.receiverNickname());
//
//        // 현재 채팅방 참여자 목록 가져오기 (Redis)
//        String participantsKey = "room:" + req.roomId() + ":participants";
//        Set<Object> participants = redisTemplate.opsForSet().members(participantsKey);
//
//        // 모든 참여자에게 메시지 브로드캐스트 (송신자 자신 포함)
//        // 각 사용자는 자신의 STOMP Principal 기반으로 메시지를 수신 (/user/{nickname}/sub/chat/room/{roomId})
//        if (participants != null && !participants.isEmpty()) {
//            participants.forEach(participant -> {
//                String participantNickname = (String) participant;
//                log.debug("Sending message to participant: {} in room {}", participantNickname, req.roomId());
//                simpMessagingTemplate.convertAndSendToUser(
//                    participantNickname,
//                    "/sub/chat/room/" + req.roomId(), // 클라이언트 구독 경로
//                    messageResponse
//                );
//            });
//        } else {
//            log.warn("No participants found in Redis for room: {}", req.roomId());
//        }
//
//        // 송신자가 채팅방을 다시 열었을 때 자신이 보낸 메시지를 새 메시지로 보지 않도록
//        // 송신자의 읽음 상태 업데이트 (자신이 보낸 메시지까지 읽음으로 처리)
//        updateUserReadCursor(String.valueOf(req.roomId()), senderNickname, savedMessage.getId(), savedMessage.getTimestamp());
//
//        // 수신자가 현재 채팅방에 접속해 있다면, 해당 메시지를 즉시 읽음 처리
//        if (req.receiverNickname() == null || req.receiverNickname().isEmpty()) {
//            log.warn("Receiver nickname is missing in ChatMessageRequest for a 1:1 chat. RoomId: {}", req.roomId());
//            return;
//        }
//
//        boolean receiverIsPresent = participants != null && participants.contains(req.receiverNickname());
//        if (receiverIsPresent) {
//            log.info("Receiver {} is present in room {}. Marking message {} as read.", req.receiverNickname(), req.roomId(), savedMessage.getId());
//            // B가 방에 있으므로, A가 보낸 메시지를 B가 즉시 읽은 것으로 간주
//            Instant readAtByReceiver = Instant.now();
//            updateUserReadCursor(String.valueOf(req.roomId()), req.receiverNickname(), savedMessage.getId(), readAtByReceiver);
//
//            // B가 메시지를 읽었다는 ACK(ReadAckResponse)를 채팅방 참여자들(특히 A)에게 전송
//            ReadAckResponse receiverReadAck = new ReadAckResponse(
//                req.roomId(),
//                req.receiverNickname(), // 이 메시지를 읽은 사람 (B)
//                savedMessage.getId(),   // 읽은 메시지 ID
//                readAtByReceiver        // 읽은 시간
//            );
//
//            // 모든 참여자에게 B의 읽음 상태 전송 (A가 이 정보를 받아 UI 업데이트)
//            // 클라이언트는 ReadAckResponse의 readerNickname이 자신이 아니면, 상대방이 읽은 것으로 간주
//            if (participants != null) {
//                participants.forEach(participant -> {
//                    String participantNickname = (String) participant;
//                    log.debug("Sending read ack (receiver {} read) to participant: {} in room {}", req.receiverNickname(), participantNickname, req.roomId());
//                    simpMessagingTemplate.convertAndSendToUser(
//                        participantNickname,
//                        "/sub/chat/read/" + req.roomId(), // 클라이언트가 읽음 확인을 구독하는 경로
//                        receiverReadAck
//                    );
//                });
//            }
//        } else {
//            // 수신자(B)가 현재 채팅방에 없음 (오프라인 또는 다른 페이지에 있음)
//            log.info("Receiver {} is NOT present in room {}. Sending notification.", req.receiverNickname(), req.roomId());
//            // 알림 서비스 호출하여 알림 생성 및 전송
//            String messagePreview = req.content();
//            if (messagePreview.length() > 50) { // 메시지 미리보기 길이 제한
//                messagePreview = messagePreview.substring(0, 47) + "...";
//            }
//            notificationService.createAndSendChatMessageNotification(
//                req.receiverNickname(),
//                senderNickname,
//                req.roomId(),
//                savedMessage.getId(), // 채팅 메시지 ID
//                messagePreview
//            );
//        }
//    }
//
//    @Transactional
//    public void markRead(ReadAckRequest req, String readerNickname) {
//        log.info("{} marks messages as read in room {} up to messageId {}", readerNickname, req.roomId(), req.lastReadMessageId());
//
//        Instant readAt = Instant.now();
//        // 읽은 사용자의 ChatRoomRead 정보 업데이트
//        updateUserReadCursor(String.valueOf(req.roomId()), readerNickname, req.lastReadMessageId(), readAt);
//
//        // 읽음 ACK 응답 페이로드 생성
//        ReadAckResponse readAckResponse = new ReadAckResponse(
//                req.roomId(),
//                readerNickname,         // 이 메시지(들)을 읽은 사람 (B)
//                req.lastReadMessageId(),// 어디까지 읽었는지
//                readAt                  // 읽은 시간
//        );
//
//        // 상대방(counterpartNickname)에게 읽음 상태 전송
//        // ReadAckRequest DTO에 counterpartNickname 필드가 있어야 합니다.
//        // 이 counterpartNickname은 '읽음'을 당한 메시지들의 원래 발신자입니다.
//        if (req.counterpartNickname() != null && !req.counterpartNickname().isEmpty()) {
//            String participantsKey = "room:" + req.roomId() + ":participants";
//            // 상대방이 현재 채팅방에 접속해 있을 때만 실시간으로 전송
//            if (Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(participantsKey, req.counterpartNickname()))) {
//                log.debug("Notifying counterpart {} that {} read messages in room {}", req.counterpartNickname(), readerNickname, req.roomId());
//                simpMessagingTemplate.convertAndSendToUser(
//                        req.counterpartNickname(),
//                        "/sub/chat/read/" + req.roomId(),
//                        readAckResponse
//                );
//            } else {
//                log.info("Counterpart {} is not in room {} for read ack.", req.counterpartNickname(), req.roomId());
//            }
//        } else {
//            log.warn("Counterpart nickname is missing in ReadAckRequest. RoomId: {}, Reader: {}", req.roomId(), readerNickname);
//        }
//
//        // 읽음 요청을 보낸 사용자 본인에게도 ACK를 보내 UI 동기화 (여러 기기 사용 등)
//        log.debug("Sending self-confirmation of read ack to {} in room {}", readerNickname, req.roomId());
//        simpMessagingTemplate.convertAndSendToUser(
//                readerNickname,
//                "/sub/chat/read/" + req.roomId(),
//                readAckResponse
//        );
//    }

}