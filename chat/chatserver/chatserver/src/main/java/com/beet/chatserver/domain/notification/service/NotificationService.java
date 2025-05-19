package com.beet.chatserver.domain.notification.service;

import com.beet.chatserver.domain.notification.dto.NotificationResponseDto;
import com.beet.chatserver.domain.notification.entity.Notification;
import com.beet.chatserver.domain.notification.entity.NotificationType;
import com.beet.chatserver.domain.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 저장과 전송이 한 트랜잭션으로 묶이진 않지만, 저장 자체는 트랜잭션 처리
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void createAndSendChatMessageNotification(
        String receiverNickname,
        String senderNickname,
        Long roomId,
        String chatMessageId,
        String messageContentPreview) {

        String notificationMessage = senderNickname + "님으로부터 새 메시지: " + messageContentPreview;
        String link = "/chat/room/" + roomId; // 클라이언트에서 이 링크를 해석하여 해당 채팅방으로 이동

        Notification notification = Notification.builder()
            .userNickname(receiverNickname)
            .type(NotificationType.NEW_CHAT_MESSAGE)
            .message(notificationMessage)
            .link(link)
            .isRead(false)
            .createdAt(LocalDateTime.now())
            .relatedEntityId(String.valueOf(roomId))
            .senderNickname(senderNickname)
            .build();

        Notification savedNotification = notificationRepository.save(notification);
        log.info("Saved chat notification for user {}: {}", receiverNickname, savedNotification.getId());

        NotificationResponseDto notificationDto = NotificationResponseDto.fromEntity(savedNotification);

        // 해당 유저의 개인 알림 채널로 전송
        String destination = "/user/" + receiverNickname + "/sub/notifications";
        System.out.println("destination: " + destination);
        simpMessagingTemplate.convertAndSendToUser(
            receiverNickname,
            "/sub/notifications",
            notificationDto
        );
        log.info("Sent notification DTO to {}: {}", destination, notificationDto);
    }

}