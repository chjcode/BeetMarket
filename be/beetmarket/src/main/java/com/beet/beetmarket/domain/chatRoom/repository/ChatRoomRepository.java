package com.beet.beetmarket.domain.chatRoom.repository;

import com.beet.beetmarket.domain.chatRoom.entity.ChatRoom;
import com.beet.beetmarket.domain.user.dto.ScheduleResponseDto;
import com.beet.beetmarket.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("""
        SELECT new com.beet.beetmarket.domain.user.dto.ScheduleResponseDto(
            c.schedule,
            c.location,
            c.seller.nickname,
            c.buyer.nickname
        )
        FROM ChatRoom c
        WHERE (c.seller = :user OR c.buyer = :user)
        AND c.schedule BETWEEN :start AND :end
        ORDER BY c.schedule
    """)
    List<ScheduleResponseDto> findAllMySchedule(User user, LocalDateTime start, LocalDateTime end);
}
