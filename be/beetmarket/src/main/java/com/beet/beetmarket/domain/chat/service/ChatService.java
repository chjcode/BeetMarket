package com.beet.beetmarket.domain.chat.service;

import com.beet.beetmarket.domain.chat.dto.ChatMessageResponseDto;
import com.beet.beetmarket.domain.chat.dto.ChatRoomInfoItem;
import com.beet.beetmarket.domain.chat.dto.ChatRoomWithFirstImageDto;
import com.beet.beetmarket.domain.chat.dto.LastReadInfoResponseDto;
import com.beet.beetmarket.domain.chat.dto.PaginatedChatMessagesResponseDto;
import com.beet.beetmarket.domain.chat.dto.PaginatedChatRoomListResponseDto;
import com.beet.beetmarket.domain.chat.entity.ChatMessage;
import com.beet.beetmarket.domain.chat.entity.ChatRoomRead;
import com.beet.beetmarket.domain.chat.exception.ChatRoomNotFoundException;
import com.beet.beetmarket.domain.chat.exception.ChatRoomParticipantsInvalidException;
import com.beet.beetmarket.domain.chat.exception.InvalidRoomIdFormatException;
import com.beet.beetmarket.domain.chat.exception.UserNotParticipantInChatRoomException;
import com.beet.beetmarket.domain.chat.repository.ChatMessageRepository;
import com.beet.beetmarket.domain.chat.repository.ChatRoomReadRepository;
import com.beet.beetmarket.domain.chatRoom.dto.ChatRoomResponseDto;
import com.beet.beetmarket.domain.chatRoom.dto.CreateChatRoomRequestDto;
import com.beet.beetmarket.domain.chatRoom.dto.ReservationResponseDto;
import com.beet.beetmarket.domain.chatRoom.entity.ChatRoom; // JPA ChatRoom 엔티티
import com.beet.beetmarket.domain.chatRoom.exception.CannotChatWithSelfException;
import com.beet.beetmarket.domain.chatRoom.repository.ChatRoomRepository; // JPA ChatRoom 리포지토리
import com.beet.beetmarket.domain.post.entity.Post;
import com.beet.beetmarket.domain.post.entity.Status;
import com.beet.beetmarket.domain.post.exception.PostAlreadyCompletedException;
import com.beet.beetmarket.domain.post.exception.PostNotFountException;
import com.beet.beetmarket.domain.post.repository.PostRepository;
import com.beet.beetmarket.domain.user.entity.User; // User 엔티티

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

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
        String roomIdStr,
        String currentUserNickname,
        Pageable pageable,
        String sortOrder
    ) {
        // roomId (String)를 Long으로 변환(MongoDB에서 String이라서)
        Long chatRoomId;
        try {
            chatRoomId = Long.parseLong(roomIdStr);
        } catch (NumberFormatException e) {
            log.error("Invalid roomId format: {}", roomIdStr, e);
            throw new InvalidRoomIdFormatException();
        }

        // ChatRoom 정보 조회
        ChatRoom chatRoom = chatRoomRepository.findByIdWithParticipants(chatRoomId)
            .orElseThrow(() -> {
                log.warn("ChatRoom not found for id: {}", chatRoomId);
                return new ChatRoomNotFoundException();
            });

        User seller = chatRoom.getSeller();
        User buyer = chatRoom.getBuyer();

        if (seller == null || buyer == null) {
            log.warn("Seller or Buyer is null for ChatRoom id: {}", chatRoomId);
            throw new ChatRoomParticipantsInvalidException();
        }

        // 현재 사용자와 상대방 식별
        String sellerOauthName = seller.getOauthName();
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

        // 메시지 목록 조회
        Page<ChatMessageResponseDto> messagesPage;
        if ("asc".equalsIgnoreCase(sortOrder)) {
            messagesPage = chatMessageRepository.findByRoomIdOrderByTimestampAsc(roomIdStr, pageable)
                .map(ChatMessageResponseDto::fromEntity);
        } else {
            messagesPage = chatMessageRepository.findByRoomIdOrderByTimestampDesc(roomIdStr, pageable)
                .map(ChatMessageResponseDto::fromEntity);
        }

        // 현재 사용자의 마지막 읽음 정보 조회
        LastReadInfoResponseDto currentUserLastReadInfo = chatRoomReadRepository
            .findByRoomIdAndUserNickname(roomIdStr, currentUserNickname)
            .map(LastReadInfoResponseDto::fromEntity)
            .orElse(null);

        // 상대방의 마지막 읽음 정보 조회
        LastReadInfoResponseDto opponentLastReadInfo = chatRoomReadRepository
            .findByRoomIdAndUserNickname(roomIdStr, opponentOauthName)
            .map(LastReadInfoResponseDto::fromEntity)
            .orElse(null);

        return new PaginatedChatMessagesResponseDto(messagesPage, currentUserLastReadInfo, opponentLastReadInfo);
    }


    @Transactional
    public ChatRoomResponseDto createOrGetChatRoom(User buyer, CreateChatRoomRequestDto requestDto) {
        Long postId = requestDto.postId();

        // 게시글 조회
        Post post = postRepository.findByIdWithUser(postId)
            .orElseThrow(PostNotFountException::new);
        User seller = post.getUser();

        // 자기 자신과의 채팅 시도인지 확인
        if (buyer.getId().equals(seller.getId())) {
            throw new CannotChatWithSelfException();
        }

        // 기존 채팅방 조회
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

            ChatRoom savedChatRoom = chatRoomRepository.save(newChatRoom);
            return ChatRoomResponseDto.fromEntity(savedChatRoom, true);
        }
    }

    @Transactional(readOnly = true)
    public PaginatedChatRoomListResponseDto getChatRoomsForUser(User currentUser, Pageable pageable) {
        int requestedSize = pageable.getPageSize();

        Pageable adjustedPageable = PageRequest.of(
            pageable.getPageNumber(),
            requestedSize + 1,
            pageable.getSortOr(Sort.by(Sort.Direction.DESC, "chatRoom.updatedAt"))
        );

        Page<ChatRoomWithFirstImageDto> chatRoomsDtoPage = chatRoomRepository.findChatRoomsForUserWithFirstImage(currentUser.getId(), adjustedPageable);

        List<ChatRoomInfoItem> chatRoomInfoItems = new ArrayList<>();
        List<String> roomIdsAsString = chatRoomsDtoPage.getContent().stream()
            .map(dto -> String.valueOf(dto.chatRoom().getId()))
            .collect(Collectors.toList());

        Map<String, ChatRoomRead> chatRoomReadsMap = chatRoomReadRepository
            .findByRoomIdInAndUserNickname(roomIdsAsString, currentUser.getOauthName())
            .stream().collect(Collectors.toMap(ChatRoomRead::getRoomId, Function.identity()));

        for (ChatRoomWithFirstImageDto dto : chatRoomsDtoPage.getContent()) {
            ChatRoom chatRoom = dto.chatRoom();
            String firstImageUrl = dto.firstImagePreview();

            String roomIdStr = String.valueOf(chatRoom.getId());
            User opponentUser;
            if (chatRoom.getSeller().getId().equals(currentUser.getId())) {
                opponentUser = chatRoom.getBuyer();
            } else {
                opponentUser = chatRoom.getSeller(); // 구매자가 상대방일 경우 판매자를 가져옴
            }

            //읽지 않은 메시지 수 계산
            long unreadCount = 0;
            ChatRoomRead chatRoomRead = chatRoomReadsMap.get(roomIdStr);
            if (chatRoomRead != null && chatRoomRead.getLastReadAt() != null) {
                unreadCount = chatMessageRepository.countByRoomIdAndTimestampAfterAndSenderNicknameNot(
                    roomIdStr,
                    chatRoomRead.getLastReadAt(),
                    currentUser.getOauthName()
                );
            } else {
                unreadCount = chatMessageRepository.countByRoomIdAndSenderNicknameNot(
                    roomIdStr,
                    currentUser.getOauthName()
                );
            }

            // 최근 메시지 정보
            Optional<ChatMessage> lastMessageOpt = chatMessageRepository.findTopByRoomIdOrderByTimestampDesc(roomIdStr);
            String lastMessageContent = lastMessageOpt.map(ChatMessage::getContent).orElse("대화 내용이 없습니다.");
            Instant lastMessageTimestampForDisplay = lastMessageOpt.map(ChatMessage::getTimestamp)
                .orElseGet(() -> chatRoom.getCreatedAt() != null ? chatRoom.getCreatedAt().toInstant(java.time.ZoneOffset.UTC) : Instant.now());

            Post post = chatRoom.getPost();

            chatRoomInfoItems.add(new ChatRoomInfoItem(
                roomIdStr,
                unreadCount,
                opponentUser.getProfileImage(),
                opponentUser.getNickname(),
                firstImageUrl,
                lastMessageContent,
                lastMessageTimestampForDisplay,
                post != null ? post.getId() : null
            ));
        }

        boolean hasNext = chatRoomsDtoPage.getContent().size() > requestedSize;
        List<ChatRoomInfoItem> finalChatRoomItems = hasNext ? new ArrayList<>(chatRoomInfoItems.subList(0, requestedSize)) : new ArrayList<>(chatRoomInfoItems);

        return new PaginatedChatRoomListResponseDto(finalChatRoomItems, hasNext);
    }

    @Transactional
    public ReservationResponseDto createOrUpdateReservation(
        String roomIdStr,
        User currentUser,
        LocalDateTime schedule,
        String location
    ) {
        Long chatRoomId;
        try {
            chatRoomId = Long.parseLong(roomIdStr);
        } catch (NumberFormatException e) {
            log.error("Invalid roomId format: {}", roomIdStr, e);
            throw new InvalidRoomIdFormatException();
        }

        ChatRoom chatRoom = chatRoomRepository.findByIdWithParticipants(chatRoomId)
            .orElseThrow(() -> new ChatRoomNotFoundException());

        // 현재 사용자가 채팅방 참여자인지 확인 (판매자 또는 구매자)
        boolean isParticipant = chatRoom.getSeller().getId().equals(currentUser.getId()) ||
            chatRoom.getBuyer().getId().equals(currentUser.getId());
        if (!isParticipant) {
            throw new UserNotParticipantInChatRoomException();
        }

        // post가 삭제된 경우 고려
        Post post = chatRoom.getPost();
        if (post == null) {
            throw new PostNotFountException();
        }

        // 예약 가능 상태 (AVAILABLE) 일 때만 예약 가능하도록 처리
        if (post.getStatus() == Status.COMPLETED) {
            throw new PostAlreadyCompletedException();
        }

        // TODO: 만약 다른 사용자와의 예약이 이미 잡혀있는 경우를 고려


        chatRoom.updateSchedule(schedule);
        chatRoom.updateLocation(location);
        chatRoomRepository.save(chatRoom);

        post.reserve();
        postRepository.save(post);

        log.info("ChatRoom ID {} 예약 설정 완료. 시간: {}, 장소: {}", chatRoomId, schedule, location);

        // TODO: 예약 설정 알림 메시지를 채팅방에 시스템 메시지로 추가하는 로직

        return ReservationResponseDto.success(chatRoom.getId(), chatRoom.getSchedule(), chatRoom.getLocation());
    }
}