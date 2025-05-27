package com.beet.chatserver.domain.chat.entity;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Document("chat_room_reads")
@Builder
@Setter
@Getter
public class ChatRoomRead {
    @Id
    private String id;
    private String roomId;
    private String userNickname;
    private String lastReadMessageId;
    private Instant lastReadAt;
}
