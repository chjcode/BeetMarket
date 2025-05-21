package com.beet.beetmarket.domain.user.service;

import com.beet.beetmarket.domain.chatRoom.repository.ChatRoomRepository;
import com.beet.beetmarket.domain.post.entity.PostDocument;
import com.beet.beetmarket.domain.post.repository.PostSearchRepository;
import com.beet.beetmarket.domain.user.dto.CreateUserInfoRequestDto;
import com.beet.beetmarket.domain.user.dto.ScheduleResponseDto;
import com.beet.beetmarket.domain.user.dto.UpdateUserInfoRequestDto;
import com.beet.beetmarket.domain.user.dto.UserNicknameProfileResponseDto;
import com.beet.beetmarket.domain.user.dto.UserResponseDto;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.domain.user.exception.NicknameAlreadyTakenException;
import com.beet.beetmarket.domain.user.exception.UserNotFoundException;
import com.beet.beetmarket.domain.user.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper; // JSON 직렬화/역직렬화

    private static final String USER_PROFILE_KEY_PREFIX = "user_profile:";
    private static final long USER_PROFILE_TTL_DAYS = 90; // 90일 TTL
    private final PostSearchRepository postSearchRepository;

    @Autowired
    public UserService(UserRepository userRepository, ChatRoomRepository chatRoomRepository,
                       StringRedisTemplate redisTemplate, ObjectMapper objectMapper, PostSearchRepository postSearchRepository) {
        this.userRepository = userRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.postSearchRepository = postSearchRepository;
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

        if(request.nickname() != null) {
            if(userRepository.findByNickname(request.nickname()).isPresent())
                throw new NicknameAlreadyTakenException();

            List<PostDocument> documents = postSearchRepository.findByAuthorNickname(user.getNickname());

            for(PostDocument postDocument : documents) {
                postDocument.setAuthorNickname(request.nickname());
                postSearchRepository.save(postDocument);
            }
        }

        user.updateAdditionalInfo(
                request.nickname() == null ? user.getNickname() : request.nickname(),
                user.getBirthDate(),
                user.getGender(),
                request.region() == null ? user.getRegion() : request.region()
        );
        user.updateProfileImage(request.profileImage());
    }

    public List<ScheduleResponseDto> getUserSchedule(Long id, LocalDateTime start, LocalDateTime end) {
        User user = userRepository.findById(id).orElseThrow(UserNotFoundException::new);
        return chatRoomRepository.findAllMySchedule(user, start, end);
    }

    @Transactional(readOnly = true)
    public UserNicknameProfileResponseDto getUserNicknameAndProfileByOauthName(String oauthName) {
        User user = userRepository.findByOauthName(oauthName)
            .orElseThrow(UserNotFoundException::new);
        return UserNicknameProfileResponseDto.from(user);
    }

    // Redis에 사용자 프로필 정보 캐싱 (닉네임, 프로필 이미지)
    public void cacheUserProfile(User user) {
        if (user == null || user.getOauthName() == null) {
            return; // OauthName이 없으면 캐싱 불가
        }
        String key = USER_PROFILE_KEY_PREFIX + user.getOauthName();
        UserNicknameProfileResponseDto profileDto = UserNicknameProfileResponseDto.from(user);
        try {
            String value = objectMapper.writeValueAsString(profileDto);
            redisTemplate.opsForValue().set(key, value, USER_PROFILE_TTL_DAYS, TimeUnit.DAYS);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to cache user profile", e);
        }
    }

    public void evictUserProfile(String oauthName) {
        if (oauthName == null || oauthName.isBlank()) {
            return;
        }
        String key = USER_PROFILE_KEY_PREFIX + oauthName;
        redisTemplate.delete(key);
    }
}
