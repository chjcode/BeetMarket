package com.beet.chatserver.domain.notification.repository;

import com.beet.chatserver.domain.notification.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByUserNicknameAndIsReadOrderByCreatedAtDesc(String userNickname, boolean isRead);

    List<Notification> findByUserNicknameOrderByCreatedAtDesc(String userNickname);
}