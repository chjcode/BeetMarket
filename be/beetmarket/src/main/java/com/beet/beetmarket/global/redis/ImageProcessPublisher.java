package com.beet.beetmarket.global.redis;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageProcessPublisher {
    private static final String STREAM_KEY = "image-process-stream";

    private final StringRedisTemplate redisTemplate;

    public void publishImages(Long postId, String postUuid, List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) return;

        Map<String,String> msg = new HashMap<>();
        msg.put("postId",  postId.toString());
        msg.put("postUuid",  postUuid);
        msg.put("imageUrls", String.join(",", imageUrls));

        redisTemplate.opsForStream()
            .add(STREAM_KEY, msg);
    }
}