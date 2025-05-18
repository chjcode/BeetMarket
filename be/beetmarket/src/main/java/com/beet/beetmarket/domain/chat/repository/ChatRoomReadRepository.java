package com.beet.beetmarket.domain.chat.repository;

import com.beet.beetmarket.domain.chat.entity.ChatRoomRead;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomReadRepository extends MongoRepository<ChatRoomRead, String> {

    Optional<ChatRoomRead> findByRoomIdAndUserNickname(String roomId, String userNickname);

    // 여러 채팅방 ID와 사용자 닉네임으로 읽음 정보 목록 조회 (배치 조회용)
    List<ChatRoomRead> findByRoomIdInAndUserNickname(List<String> roomIds, String userNickname);
}