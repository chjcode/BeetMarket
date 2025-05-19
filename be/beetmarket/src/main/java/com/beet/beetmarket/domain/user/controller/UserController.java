package com.beet.beetmarket.domain.user.controller;

import com.beet.beetmarket.domain.user.dto.CreateUserInfoRequestDto;
import com.beet.beetmarket.domain.user.dto.ScheduleResponseDto;
import com.beet.beetmarket.domain.user.dto.UpdateUserInfoRequestDto;
import com.beet.beetmarket.domain.user.dto.UserNicknameProfileResponseDto;
import com.beet.beetmarket.domain.user.dto.UserResponseDto;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.domain.user.service.UserService;
import com.beet.beetmarket.global.response.ResponseWrapper;
import com.beet.beetmarket.global.response.ResponseWrapperFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/my")
    public ResponseEntity<ResponseWrapper<UserResponseDto>> getSelf(
            @AuthenticationPrincipal User user
    ) {
        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null,
                userService.getUserById(user.getId())
        );
    }

    @GetMapping("/{nickname}")
    public ResponseEntity<ResponseWrapper<UserResponseDto>> getUserByNickname(
            @PathVariable String nickname
    ) {
        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null,
                userService.getUserByNickname(nickname)
        );
    }

    @PostMapping("/signup")
    public ResponseEntity<ResponseWrapper<Void>> addUserInfo(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateUserInfoRequestDto request
    ) {
        userService.addUserInfo(user.getId(), request);

        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null
        );
    }

    @PatchMapping("/my")
    public ResponseEntity<ResponseWrapper<Void>> updateUserInfo(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateUserInfoRequestDto request
    ) {
        userService.updateUserInfo(user.getId(), request);

        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null
        );
    }

    @GetMapping("/my/schedule")
    public ResponseEntity<ResponseWrapper<List<ScheduleResponseDto>>> getUserSchedule(
            @AuthenticationPrincipal User user,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end
    ) {
        List<ScheduleResponseDto> scheduleResponseDtoList = userService.getUserSchedule(user.getId(), start, end);

        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null,
                scheduleResponseDtoList
        );
    }

    @GetMapping("/oauth/{oauthName}")
    public ResponseEntity<ResponseWrapper<UserNicknameProfileResponseDto>> getUserNicknameAndProfileByOauthName(
        @PathVariable String oauthName
    ) {
        UserNicknameProfileResponseDto responseDto = userService.getUserNicknameAndProfileByOauthName(oauthName);
        return ResponseWrapperFactory.setResponse(
            HttpStatus.OK,
            null,
            responseDto
        );
    }
}
