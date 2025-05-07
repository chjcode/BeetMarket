package com.beet.beetmarket.domain.post.service;

import com.beet.beetmarket.domain.post.dto.response.PostDto;
import com.beet.beetmarket.domain.post.entity.Post;
import com.beet.beetmarket.domain.post.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }


    public PostDto getPost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow();

        return PostDto.from(post);
    }
}
