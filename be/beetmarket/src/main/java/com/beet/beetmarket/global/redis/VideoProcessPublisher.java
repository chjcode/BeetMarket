package com.beet.beetmarket.global.redis;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VideoProcessPublisher {
    private static final String STREAM_KEY = "video-process-stream";
    private final StringRedisTemplate redisTemplate;

    public void publishVideos(Long userId, Long postId, String postUuid, String videoUrl) {
        if (videoUrl == null || videoUrl.isBlank()) return;

        Map<String,String> msg = new HashMap<>();
        msg.put("userId", String.valueOf(userId));
        msg.put("postId", postId.toString());
        msg.put("postUuid",  postUuid);
        msg.put("videoUrl", videoUrl);

        redisTemplate.opsForStream()
            .add(STREAM_KEY, msg);
    }
}