package com.beet.beetmarket.domain.notification.service;

import com.beet.beetmarket.domain.notification.dto.NotificationResponseDto;
import com.beet.beetmarket.domain.notification.entity.Notification;
import com.beet.beetmarket.domain.notification.repository.NotificationRepository;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects; // Objects.nonNull 사용을 위해 추가
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<NotificationResponseDto> getNotificationsForUser(User currentUser, Boolean isRead, Pageable pageable) {
        String recipientOauthName = currentUser.getOauthName();
        Page<Notification> notificationsPage;

        if (isRead != null) {
            notificationsPage = notificationRepository.findByUserNicknameAndIsReadOrderByCreatedAtDesc(recipientOauthName, isRead, pageable);
        } else {
            notificationsPage = notificationRepository.findByUserNicknameOrderByCreatedAtDesc(recipientOauthName, pageable);
        }
        log.info("Fetched notifications for user (oauthName): {}, isRead: {}, page: {}", recipientOauthName, isRead, pageable.getPageNumber());

        List<String> senderOauthNames = notificationsPage.getContent().stream()
            .map(Notification::getSenderNickname) // senderNickname은 oauthName을 담고 있음
            .filter(name -> name != null && !name.isEmpty())
            .distinct()
            .collect(Collectors.toList());

        Map<String, String> senderOauthNameToDisplayNicknameMap = new HashMap<>();
        if (!senderOauthNames.isEmpty()) {
            List<User> senderUsers = userRepository.findByOauthNameIn(senderOauthNames);

            senderOauthNameToDisplayNicknameMap = senderUsers.stream()
                .filter(Objects::nonNull) // 1. List 내의 null User 객체 제거
                .filter(user -> user.getOauthName() != null) // 2. oauthName이 null인 User 객체 제거 (Map의 Key는 null 불허)
                .collect(Collectors.toMap(
                    User::getOauthName, // Key
                    User::getNickname,  // Value (User.nickname은 NOT NULL이라고 가정)
                    (existingValue, newValue) -> existingValue // 중복 Key 발생 시 (oauthName unique 제약으로 거의 발생 안 함)
                ));
        }

        Map<String, String> finalSenderMap = senderOauthNameToDisplayNicknameMap; // Effectively final for lambda
        return notificationsPage.map(notification -> {
            String displaySenderNickname = finalSenderMap.getOrDefault(
                notification.getSenderNickname(), // key: 발신자 oauthName
                notification.getSenderNickname()  // fallback: Map에 없거나, 알림의 senderNickname이 null인 경우 원본 값 사용
            );

            return new NotificationResponseDto(
                notification.getId(),
                notification.getUserNickname(), // 수신자 oauthName
                notification.getType(),
                notification.getMessage(),      // DB 원본 메시지
                notification.getLink(),
                notification.isRead(),
                notification.getCreatedAt(),
                notification.getRelatedEntityId(),
                displaySenderNickname         // 발신자 화면 표시용 닉네임
            );
        });
    }

    @Transactional(readOnly = true)
    public long getUnreadNotificationCount(User currentUser) {
        String userOauthName = currentUser.getOauthName();
        long count = notificationRepository.countByUserNicknameAndIsRead(userOauthName, false);
        log.info("Fetched unread notification count for user (oauthName): {}: {}", userOauthName, count);
        return count;
    }

    @Transactional
    public Optional<NotificationResponseDto> markNotificationAsRead(User currentUser, String notificationId) {
        String recipientOauthName = currentUser.getOauthName();
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);

        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            if (!notification.getUserNickname().equals(recipientOauthName)) {
                log.warn("User (oauthName: {}) attempted to mark notification {} as read, but it belongs to {}",
                    recipientOauthName, notificationId, notification.getUserNickname());
                return Optional.empty();
            }

            boolean needsSave = false;
            if (!notification.isRead()) {
                notification.setRead(true);
                needsSave = true;
            }

            String displaySenderNickname = notification.getSenderNickname(); // 기본값은 oauthName
            if (notification.getSenderNickname() != null && !notification.getSenderNickname().isEmpty()) {
                Optional<User> senderUserOpt = userRepository.findByOauthName(notification.getSenderNickname());
                // User.nickname은 NOT NULL이므로, senderUserOpt가 존재하면 nickname도 존재함.
                displaySenderNickname = senderUserOpt.map(User::getNickname)
                    .orElse(notification.getSenderNickname()); // User 없으면 기존 oauthName 유지
            }

            if (needsSave) {
                notificationRepository.save(notification);
                log.info("Notification {} marked as read for user (oauthName: {})", notificationId, recipientOauthName);
            }

            return Optional.of(new NotificationResponseDto(
                notification.getId(),
                notification.getUserNickname(),
                notification.getType(),
                notification.getMessage(),
                notification.getLink(),
                notification.isRead(),
                notification.getCreatedAt(),
                notification.getRelatedEntityId(),
                displaySenderNickname
            ));
        }
        log.warn("Notification with id {} not found for marking as read.", notificationId);
        return Optional.empty();
    }

    @Transactional
    public long markAllNotificationsAsRead(User currentUser) {
        String userOauthName = currentUser.getOauthName();
        List<Notification> unreadNotifications = notificationRepository.findByUserNicknameAndIsRead(userOauthName, false);
        if (unreadNotifications.isEmpty()) {
            log.info("No unread notifications to mark as read for user (oauthName: {})", userOauthName);
            return 0;
        }
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(unreadNotifications);
        log.info("Marked {} notifications as read for user (oauthName: {})", unreadNotifications.size(), userOauthName);
        return unreadNotifications.size();
    }
}