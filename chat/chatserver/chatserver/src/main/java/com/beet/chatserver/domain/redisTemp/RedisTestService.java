package com.beet.chatserver.domain.redisTemp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisTestService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Autowired
    public RedisTestService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Redis 연결 테스트:
     * - 키 "health-check"에 값 저장
     * - 즉시 조회 및 삭제
     * @return true면 정상, false면 오류
     */
    public boolean checkConnection() {
        String testKey = "health-check";
        String testValue = "OK";

        try {
            // 값 저장
            redisTemplate.opsForValue().set(testKey, testValue);

            // 값 조회
            Object value = redisTemplate.opsForValue().get(testKey);
            if (!testValue.equals(value)) {
                return false;
            }

            // 키 삭제
            Boolean deleted = redisTemplate.delete(testKey);
            return Boolean.TRUE.equals(deleted);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
