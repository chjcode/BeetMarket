package com.beet.beetmarket.domain.chat.controller;

import com.beet.beetmarket.domain.chat.dto.ChatMessageResponseDto;
import com.beet.beetmarket.domain.chat.dto.PaginatedChatMessagesResponseDto;
import com.beet.beetmarket.domain.chat.service.ChatService;
import com.beet.beetmarket.domain.chatRoom.dto.ChatRoomResponseDto;
import com.beet.beetmarket.domain.chatRoom.dto.CreateChatRoomRequestDto;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.global.response.ResponseWrapper;
import com.beet.beetmarket.global.response.ResponseWrapperFactory;

import co.elastic.clients.elasticsearch.nodes.Http;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat/rooms")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * 특정 채팅방의 메시지 목록을 조회합니다.
     * 예: GET /api/v1/chat/rooms/{roomId}/messages?page=0&size=20&sortOrder=desc
     *
     * @param roomId 채팅방 ID
     * @param pageable 페이지네이션 정보 (기본 20개, 최신순)
     * 클라이언트에서 page, size, sort 파라미터를 통해 제어 가능.
     * 예: /messages?page=0&size=30&sort=timestamp,desc
     * PageableDefault를 사용하면 기본 정렬이 적용되지만, 서비스에서 명시적으로 처리하기 위해 sortOrder 파라미터를 추가.
     * @param sortOrder 정렬 순서 ("asc" 또는 "desc"). 기본은 "desc" (최신순).
     * @return 페이징된 채팅 메시지 응답
     */
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<ResponseWrapper<PaginatedChatMessagesResponseDto>> getChatMessages(
        @AuthenticationPrincipal User user,
        @PathVariable String roomId,
        @PageableDefault(size = 20) Pageable pageable,
        @RequestParam(name = "sortOrder", defaultValue = "desc") String sortOrder) {

        PaginatedChatMessagesResponseDto response = chatService.getChatMessagesByRoomId(
            roomId,
            user.getOauthName(),
            pageable,
            sortOrder
        );

        return ResponseWrapperFactory.setResponse(
            HttpStatus.OK,
            null,
            response
        );
    }

    /**
     * 새로운 채팅방을 생성하거나 기존 채팅방 정보를 반환합니다.
     * POST /api/chat/rooms
     *
     * @param user 현재 로그인한 사용자 (구매자)
     * @param requestDto 게시글 ID를 포함한 요청 DTO
     * @return 생성되거나 조회된 채팅방 정보
     */
    @PostMapping
    public ResponseEntity<ResponseWrapper<ChatRoomResponseDto>> createChatRoom(
        @AuthenticationPrincipal User user,
        @Valid @RequestBody CreateChatRoomRequestDto requestDto
    ) {
        ChatRoomResponseDto responseDto = chatService.createOrGetChatRoom(user, requestDto);

        HttpStatus status = responseDto.isNew() ? HttpStatus.CREATED : HttpStatus.OK;

        return ResponseWrapperFactory.setResponse(
            status,
            null,
            responseDto
        );
    }
}