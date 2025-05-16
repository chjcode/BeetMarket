package com.beet.chatserver.domain.chat.repository;


import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.beet.chatserver.domain.chat.entity.ChatRoomRead;

public interface ChatRoomReadRepository extends MongoRepository<ChatRoomRead, String> {
    Optional<ChatRoomRead> findByRoomIdAndUserNickname(String roomId, String userNickname);
}