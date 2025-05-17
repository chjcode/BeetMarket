package com.beet.beetmarket.domain.chat.repository;

import com.beet.beetmarket.domain.chat.entity.ChatRoomRead;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ChatRoomReadRepository extends MongoRepository<ChatRoomRead, String> {
    Optional<ChatRoomRead> findByRoomIdAndUserNickname(String roomId, String userNickname);
}