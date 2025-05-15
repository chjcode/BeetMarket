package com.beet.chatserver.domain.chat.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.beet.chatserver.domain.chat.entity.ChatMessage;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByRoomIdOrderByTimestamp(String roomId);
}
