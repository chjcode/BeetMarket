package com.beet.chatserver.domain.chat.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.beet.chatserver.domain.chat.dto.ChatMessageRequest;
import com.beet.chatserver.domain.chat.dto.ReadAckRequest;
import com.beet.chatserver.domain.chat.service.ChatService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /* 송신: /pub/chat/message */
    @MessageMapping("/chat/message")
    public void send(ChatMessageRequest req, Principal p) {
        chatService.processMessage(req, p.getName());
    }

    /* 읽음 ACK: /pub/chat/read */
    @MessageMapping("/chat/read")
    public void ackRead(ReadAckRequest req, Principal p) {
        chatService.markRead(req, p.getName());
    }
}
