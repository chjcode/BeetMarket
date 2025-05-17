package com.beet.beetmarket.domain.chatRoom.repository;

import com.beet.beetmarket.domain.chatRoom.entity.ChatRoom;
import com.beet.beetmarket.domain.post.entity.Post;
import com.beet.beetmarket.domain.user.dto.ScheduleResponseDto;
import com.beet.beetmarket.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("""
        SELECT new com.beet.beetmarket.domain.user.dto.ScheduleResponseDto(
           c.schedule,
           c.location,
           CASE WHEN c.seller.id = :userId THEN '판매' ELSE '구매' END,
           CASE WHEN c.seller.id = :userId THEN c.buyer.nickname ELSE c.seller.nickname END,
           c.post.title,
           i.imagePreview
        )
        FROM ChatRoom c
        JOIN Image i ON i.post = c.post AND i.sequence = 0
        WHERE (c.seller.id = :userId OR c.buyer.id = :userId)
        AND c.post.status = com.beet.beetmarket.domain.post.entity.Status.RESERVED
        AND c.schedule BETWEEN :start AND :end
        ORDER BY c.schedule
    """)
    List<ScheduleResponseDto> findAllMySchedule(User user, LocalDateTime start, LocalDateTime end);

    @Query("SELECT cr FROM ChatRoom cr LEFT JOIN FETCH cr.seller LEFT JOIN FETCH cr.buyer WHERE cr.id = :id")
    Optional<ChatRoom> findByIdWithParticipants(@Param("id") Long id);

    /**
     * 구매자, 판매자, 게시글을 기준으로 채팅방을 조회합니다.
     * @param buyer 구매자 User 엔티티
     * @param seller 판매자 User 엔티티
     * @param post 게시글 Post 엔티티
     * @return Optional<ChatRoom>
     */
    Optional<ChatRoom> findByBuyerAndSellerAndPost(User buyer, User seller, Post post);
}
