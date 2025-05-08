package com.beet.beetmarket.domain.post.controller;

import com.beet.beetmarket.domain.post.dto.request.CreatePostRequestDto;
import com.beet.beetmarket.domain.post.dto.request.UpdatePostRequestDto;
import com.beet.beetmarket.domain.post.dto.response.PostDto;
import com.beet.beetmarket.domain.post.service.PostService;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.global.response.ResponseWrapper;
import com.beet.beetmarket.global.response.ResponseWrapperFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }


    @GetMapping("/{postId}")
    public ResponseEntity<ResponseWrapper<PostDto>> getPost(@PathVariable Long postId) {
        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null,
                postService.getPost(postId)
        );
    }

    @PostMapping
    public ResponseEntity<ResponseWrapper<Void>> createPost(
            @AuthenticationPrincipal User user,
            @RequestBody CreatePostRequestDto request) {

        postService.createPost(user.getId(), request);

        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null
        );
    }

    @PatchMapping("/{postId}")
    public ResponseEntity<ResponseWrapper<Void>> updatePost(
            @AuthenticationPrincipal User user,
            @PathVariable Long postId,
            @RequestBody UpdatePostRequestDto request
    ) {
        postService.updatePost(user.getId(), postId, request);

        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null
        );
    }

}
