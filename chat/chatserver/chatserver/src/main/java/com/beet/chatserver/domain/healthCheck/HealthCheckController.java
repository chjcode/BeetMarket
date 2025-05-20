package com.beet.chatserver.domain.healthCheck;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthCheckController {

    @GetMapping("/api/chat-health") // 테스트용 엔드포인트 경로
    public ResponseEntity<Map<String, Object>> checkChatServerHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "Chat server is up and running!");
        response.put("serverTime", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}