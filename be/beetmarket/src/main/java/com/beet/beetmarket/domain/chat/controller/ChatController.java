package com.beet.beetmarket.domain.chat.controller;

import com.beet.beetmarket.domain.chat.dto.ChatMessageResponseDto;
import com.beet.beetmarket.domain.chat.dto.PaginatedChatMessagesResponseDto;
import com.beet.beetmarket.domain.chat.dto.PaginatedChatRoomListResponseDto;
import com.beet.beetmarket.domain.chat.dto.SuggestedScheduleResponseDto;
import com.beet.beetmarket.domain.chat.service.ChatService;
import com.beet.beetmarket.domain.chatRoom.dto.ChatRoomResponseDto;
import com.beet.beetmarket.domain.chatRoom.dto.ChatRoomSummaryDto;
import com.beet.beetmarket.domain.chatRoom.dto.CreateChatRoomRequestDto;
import com.beet.beetmarket.domain.chatRoom.dto.CreateReservationRequestDto;
import com.beet.beetmarket.domain.chatRoom.dto.ReservationResponseDto;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.global.response.ResponseWrapper;
import com.beet.beetmarket.global.response.ResponseWrapperFactory;

import co.elastic.clients.elasticsearch.nodes.Http;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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

    @GetMapping
    public ResponseEntity<ResponseWrapper<PaginatedChatRoomListResponseDto>> getChatRooms(
        @AuthenticationPrincipal User currentUser,
        @PageableDefault(size = 10, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable // 기본 10개, updatedAt 내림차순 정렬
    ) {
        PaginatedChatRoomListResponseDto response = chatService.getChatRoomsForUser(currentUser, pageable);
        return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
    }

    @PatchMapping("/{roomId}/reserve")
    public ResponseEntity<ResponseWrapper<ReservationResponseDto>> createOrUpdateReservation(
        @AuthenticationPrincipal User user,
        @PathVariable String roomId,
        @Valid @RequestBody CreateReservationRequestDto requestDto
    ) {
        ReservationResponseDto response = chatService.createOrUpdateReservation(
            roomId,
            user,
            requestDto.schedule(),
            requestDto.location()
        );
        return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
    }

    @GetMapping("/{roomId}/schedule-suggestion")
    public ResponseEntity<ResponseWrapper<SuggestedScheduleResponseDto>> getScheduleSuggestionFromChat(
        @AuthenticationPrincipal User user,
        @PathVariable String roomId
    ) {
        SuggestedScheduleResponseDto suggestion = chatService.suggestScheduleFromChat(roomId, user);

        return ResponseWrapperFactory.setResponse(
            HttpStatus.OK,
            null,
            suggestion
        );
    }
}