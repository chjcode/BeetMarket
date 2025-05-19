package com.beet.beetmarket.domain.notification.controller;

import com.beet.beetmarket.domain.notification.dto.NotificationResponseDto;
import com.beet.beetmarket.domain.notification.service.NotificationService;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.global.response.ResponseWrapper;
import com.beet.beetmarket.global.response.ResponseWrapperFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ResponseWrapper<Page<NotificationResponseDto>>> getMyNotifications(
        @AuthenticationPrincipal User currentUser,
        @RequestParam(required = false) Boolean isRead, // 읽음 상태 필터 (true, false, 또는 null(전체))
        @PageableDefault(size = 10, sort = "createdAt,desc") Pageable pageable) {

        Page<NotificationResponseDto> notifications = notificationService.getNotificationsForUser(currentUser, isRead, pageable);
        return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, notifications);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ResponseWrapper<Long>> getMyUnreadNotificationCount(
        @AuthenticationPrincipal User currentUser) {
        long count = notificationService.getUnreadNotificationCount(currentUser);
        return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, count);
    }

    @PostMapping("/{notificationId}/read")
    public ResponseEntity<ResponseWrapper<NotificationResponseDto>> markAsRead(
        @AuthenticationPrincipal User currentUser,
        @PathVariable String notificationId) {

        return notificationService.markNotificationAsRead(currentUser, notificationId)
            .map(dto -> ResponseWrapperFactory.setResponse(HttpStatus.OK, null, dto))
            .orElse(ResponseWrapperFactory.setResponse(HttpStatus.NOT_FOUND, null, null));
    }

    @PostMapping("/read-all")
    public ResponseEntity<ResponseWrapper<String>> markAllAsRead(
        @AuthenticationPrincipal User currentUser) {
        long count = notificationService.markAllNotificationsAsRead(currentUser);
        return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, null);
    }
}