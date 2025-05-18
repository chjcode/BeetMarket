package com.beet.beetmarket.domain.chat.repository;

import java.time.Instant;
import java.util.Optional;

import com.beet.beetmarket.domain.chat.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    /**
     * 특정 채팅방의 메시지를 시간 내림차순으로 페이지네이션하여 조회합니다.
     * (최신 메시지가 먼저 오도록)
     * @param roomId 채팅방 ID
     * @param pageable 페이지 요청 정보 (페이지 번호, 페이지 크기, 정렬 정보 포함)
     * @return 페이징된 채팅 메시지 목록
     */
    Page<ChatMessage> findByRoomIdOrderByTimestampDesc(String roomId, Pageable pageable);

    /**
     * 특정 채팅방의 메시지를 시간 오름차순으로 페이지네이션하여 조회합니다.
     * (오래된 메시지가 먼저 오도록)
     * @param roomId 채팅방 ID
     * @param pageable 페이지 요청 정보
     * @return 페이징된 채팅 메시지 목록
     */
    Page<ChatMessage> findByRoomIdOrderByTimestampAsc(String roomId, Pageable pageable);

    // 특정 시간 이후, 특정 사용자가 보내지 않은 메시지 수 카운트
    long countByRoomIdAndTimestampAfterAndSenderNicknameNot(String roomId, Instant timestamp, String senderNickname);

    // 특정 사용자가 보내지 않은 해당 채팅방의 전체 메시지 수 카운트
    long countByRoomIdAndSenderNicknameNot(String roomId, String senderNickname);

    // 해당 채팅방의 가장 최근 메시지 조회
    Optional<ChatMessage> findTopByRoomIdOrderByTimestampDesc(String roomId);
}