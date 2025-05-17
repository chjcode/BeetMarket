package com.beet.beetmarket.domain.chat.service;

import com.beet.beetmarket.domain.chat.dto.ChatMessageResponseDto;
import com.beet.beetmarket.domain.chat.dto.LastReadInfoResponseDto;
import com.beet.beetmarket.domain.chat.dto.PaginatedChatMessagesResponseDto;
import com.beet.beetmarket.domain.chat.entity.ChatRoomRead;
import com.beet.beetmarket.domain.chat.exception.ChatRoomNotFoundException;
import com.beet.beetmarket.domain.chat.exception.ChatRoomParticipantsInvalidException;
import com.beet.beetmarket.domain.chat.exception.InvalidRoomIdFormatException;
import com.beet.beetmarket.domain.chat.exception.UserNotParticipantInChatRoomException;
import com.beet.beetmarket.domain.chat.repository.ChatMessageRepository;
import com.beet.beetmarket.domain.chat.repository.ChatRoomReadRepository;
import com.beet.beetmarket.domain.chatRoom.dto.ChatRoomResponseDto;
import com.beet.beetmarket.domain.chatRoom.dto.CreateChatRoomRequestDto;
import com.beet.beetmarket.domain.chatRoom.entity.ChatRoom; // JPA ChatRoom 엔티티
import com.beet.beetmarket.domain.chatRoom.exception.CannotChatWithSelfException;
import com.beet.beetmarket.domain.chatRoom.repository.ChatRoomRepository; // JPA ChatRoom 리포지토리
import com.beet.beetmarket.domain.post.entity.Post;
import com.beet.beetmarket.domain.post.exception.PostNotFountException;
import com.beet.beetmarket.domain.post.repository.PostRepository;
import com.beet.beetmarket.domain.user.entity.User; // User 엔티티
import com.beet.beetmarket.global.exception.CustomException; // 예외 처리용 (필요시 생성)

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository; // MongoDB
    private final ChatRoomReadRepository chatRoomReadRepository; // MongoDB
    private final ChatRoomRepository chatRoomRepository; // JPA
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public PaginatedChatMessagesResponseDto getChatMessagesByRoomId(
        String roomIdStr, // roomId는 이제 JPA ChatRoom의 ID (String 형태)
        String currentUserNickname,
        Pageable pageable,
        String sortOrder
    ) {
        // 1. roomId (String)를 Long으로 변환
        Long chatRoomId;
        try {
            chatRoomId = Long.parseLong(roomIdStr);
        } catch (NumberFormatException e) {
            log.error("Invalid roomId format: {}", roomIdStr, e);
            throw new InvalidRoomIdFormatException();
        }

        // 2. JPA ChatRoom 정보 조회 (참여자 정보 포함)
        ChatRoom chatRoom = chatRoomRepository.findByIdWithParticipants(chatRoomId)
            .orElseThrow(() -> {
                log.warn("ChatRoom not found for id: {}", chatRoomId);
                return new ChatRoomNotFoundException(); // 적절한 예외 처리
            });

        User seller = chatRoom.getSeller();
        User buyer = chatRoom.getBuyer();

        if (seller == null || buyer == null) {
            log.warn("Seller or Buyer is null for ChatRoom id: {}", chatRoomId);
            throw new ChatRoomParticipantsInvalidException();
        }

        // 3. 현재 사용자와 상대방 식별
        String sellerOauthName = seller.getOauthName(); // User 엔티티에 getNickname()이 있다고 가정
        String buyerOauthName = buyer.getOauthName();
        String opponentOauthName;

        if (currentUserNickname.equals(sellerOauthName)) {
            opponentOauthName = buyerOauthName;
        } else if (currentUserNickname.equals(buyerOauthName)) {
            opponentOauthName = sellerOauthName;
        } else {
            // 현재 사용자가 해당 채팅방의 참여자가 아닌 경우
            log.warn("User {} is not a participant in ChatRoom id: {}", currentUserNickname, chatRoomId);
            throw new UserNotParticipantInChatRoomException();
        }

        // 4. 메시지 목록 조회 (MongoDB)
        Page<ChatMessageResponseDto> messagesPage;
        if ("asc".equalsIgnoreCase(sortOrder)) {
            messagesPage = chatMessageRepository.findByRoomIdOrderByTimestampAsc(roomIdStr, pageable)
                .map(ChatMessageResponseDto::fromEntity);
        } else {
            messagesPage = chatMessageRepository.findByRoomIdOrderByTimestampDesc(roomIdStr, pageable)
                .map(ChatMessageResponseDto::fromEntity);
        }

        // 5. 현재 사용자의 마지막 읽음 정보 조회 (MongoDB)
        LastReadInfoResponseDto currentUserLastReadInfo = chatRoomReadRepository
            .findByRoomIdAndUserNickname(roomIdStr, currentUserNickname)
            .map(LastReadInfoResponseDto::fromEntity)
            .orElse(null);

        // 6. 상대방의 마지막 읽음 정보 조회 (MongoDB)
        LastReadInfoResponseDto opponentLastReadInfo = chatRoomReadRepository
            .findByRoomIdAndUserNickname(roomIdStr, opponentOauthName)
            .map(LastReadInfoResponseDto::fromEntity)
            .orElse(null);

        // 7. 최종 응답 객체 생성
        return new PaginatedChatMessagesResponseDto(messagesPage, currentUserLastReadInfo, opponentLastReadInfo);
    }

    /**
     * 채팅방을 생성하거나 기존 채팅방을 반환합니다.
     *
     * @param buyer 현재 로그인한 사용자 (구매자)
     * @param requestDto 게시글 ID를 담은 요청 DTO
     * @return 생성되거나 조회된 채팅방 정보 DTO
     */
    @Transactional // 쓰기 작업이므로 트랜잭션 처리
    public ChatRoomResponseDto createOrGetChatRoom(User buyer, CreateChatRoomRequestDto requestDto) {
        Long postId = requestDto.postId();

        // 1. 게시글 조회 (판매자 정보 포함)
        Post post = postRepository.findByIdWithUser(postId)
            .orElseThrow(PostNotFountException::new);
        User seller = post.getUser();

        // 2. 자기 자신과의 채팅 시도인지 확인
        // User 엔티티의 ID (PK)를 비교하는 것이 좋습니다.
        if (buyer.getId().equals(seller.getId())) {
            throw new CannotChatWithSelfException();
        }

        // 3. 기존 채팅방 조회
        Optional<ChatRoom> existingChatRoomOpt = chatRoomRepository.findByBuyerAndSellerAndPost(buyer, seller, post);

        if (existingChatRoomOpt.isPresent()) {
            // 이미 채팅방이 존재하면 해당 정보 반환
            return ChatRoomResponseDto.fromEntity(existingChatRoomOpt.get(), false);
        } else {
            // 채팅방이 없으면 새로 생성
            ChatRoom newChatRoom = ChatRoom.builder()
                .buyer(buyer)
                .seller(seller)
                .post(post)
                .build();
            // ChatRoom 엔티티의 lastMessageAt 필드는 메시지가 추가될 때 업데이트 되어야 합니다.
            // 초기 생성 시에는 null이거나 특정 기본값일 수 있습니다.

            ChatRoom savedChatRoom = chatRoomRepository.save(newChatRoom);
            return ChatRoomResponseDto.fromEntity(savedChatRoom, true);
        }
    }
}