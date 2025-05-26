package com.beet.beetmarket.domain.notification.repository;

import com.beet.beetmarket.domain.notification.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    // userNickname (User.oauthName 값) 기준으로 조회
    Page<Notification> findByUserNicknameAndIsReadOrderByCreatedAtDesc(String userNickname, boolean isRead, Pageable pageable);
    Page<Notification> findByUserNicknameOrderByCreatedAtDesc(String userNickname, Pageable pageable);
    List<Notification> findByUserNicknameAndIsRead(String userNickname, boolean isRead);

    // 안 읽은 알림 개수 조회용
    long countByUserNicknameAndIsRead(String userNickname, boolean isRead);
}