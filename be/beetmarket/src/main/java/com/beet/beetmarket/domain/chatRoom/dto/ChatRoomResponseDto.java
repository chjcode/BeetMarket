package com.beet.beetmarket.domain.chatRoom.dto;

import com.beet.beetmarket.domain.chatRoom.entity.ChatRoom;
import com.beet.beetmarket.domain.post.entity.Post;
import com.beet.beetmarket.domain.user.entity.User;

import java.time.LocalDateTime;

public record ChatRoomResponseDto(
    Long roomId,
    Long postId,
    String postTitle,
    ParticipantDto seller,
    ParticipantDto buyer,
    LocalDateTime createdAt,
    boolean isNew
) {
    public static ChatRoomResponseDto fromEntity(ChatRoom chatRoom, boolean isNew) {
        Post post = chatRoom.getPost();
        return new ChatRoomResponseDto(
            chatRoom.getId(),
            post.getId(),
            post.getTitle(),
            ParticipantDto.fromUser(chatRoom.getSeller()),
            ParticipantDto.fromUser(chatRoom.getBuyer()),
            chatRoom.getCreatedAt(), // BaseTimeEntity의 createdAt 사용
            isNew
        );
    }

    // 참여자 정보
    public record ParticipantDto(
        Long userId,
        String nickname,
        String oauthName,
        String profileImageUrl
    ) {
        public static ParticipantDto fromUser(User user) {
            return new ParticipantDto(
                user.getId(),
                user.getNickname(),
                user.getOauthName(),
                user.getProfileImage()
            );
        }
    }
}