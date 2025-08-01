package com.beet.beetmarket.domain.chat.entity;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter; // Setter가 필요할 수 있습니다 (chatserver의 것과 동일하게).

@Document("chat_room_reads")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomRead {
    @Id
    private String id;
    private String roomId;
    private String userNickname;
    private String lastReadMessageId;
    private Instant lastReadAt;
}