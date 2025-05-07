package com.beet.beetmarket.domain.user.service;

import com.beet.beetmarket.domain.chatRoom.repository.ChatRoomRepository;
import com.beet.beetmarket.domain.user.dto.CreateUserInfoRequestDto;
import com.beet.beetmarket.domain.user.dto.ScheduleResponseDto;
import com.beet.beetmarket.domain.user.dto.UpdateUserInfoRequestDto;
import com.beet.beetmarket.domain.user.dto.UserResponseDto;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.domain.user.exception.NicknameAlreadyTakenException;
import com.beet.beetmarket.domain.user.exception.UserNotFoundException;
import com.beet.beetmarket.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class UserService {

    UserRepository userRepository;
    ChatRoomRepository chatRoomRepository;

    @Autowired
    public UserService(UserRepository userRepository, ChatRoomRepository chatRoomRepository) {
        this.userRepository = userRepository;
        this.chatRoomRepository = chatRoomRepository;
    }

    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(UserNotFoundException::new);

        return UserResponseDto.from(user);
    }

    public UserResponseDto getUserByNickname(String nickname) {
        User user = userRepository.findByNickname(nickname).orElseThrow(UserNotFoundException::new);

        return UserResponseDto.from(user);
    }


    public void addUserInfo(Long userId, CreateUserInfoRequestDto request) {
        userRepository.findByNickname(request.nickname())
                .ifPresent(u -> { throw new NicknameAlreadyTakenException(); });

        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        user.updateAdditionalInfo(
                request.nickname(),
                request.birthDate(),
                request.gender(),
                request.region()
        );
    }

    public void updateUserInfo(Long userId, UpdateUserInfoRequestDto request) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

        user.updateAdditionalInfo(
                request.nickname(),
                user.getBirthDate(),
                user.getGender(),
                request.region()
        );
        user.updateProfileImage(request.profileImage());
    }

    public List<ScheduleResponseDto> getUserSchedule(Long id, LocalDateTime start, LocalDateTime end) {
        User user = userRepository.findById(id).orElseThrow(UserNotFoundException::new);
        return chatRoomRepository.findAllMySchedule(user, start, end);
    }
}
