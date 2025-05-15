package com.beet.chatserver.domain.redisTemp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RedisTestController {

    private final RedisTestService redisTestService;

    @Autowired
    public RedisTestController(RedisTestService redisTestService) {
        this.redisTestService = redisTestService;
    }

    /**
     * Redis 연결 상태 확인
     * GET /redis/health
     */
    @GetMapping("/redis/health")
    public ResponseEntity<String> healthCheck() {
        boolean ok = redisTestService.checkConnection();
        if (ok) {
            return ResponseEntity.ok("Redis is up and running 👍");
        } else {
            return ResponseEntity.status(500).body("Redis connection FAILED 🚨");
        }
    }
}
