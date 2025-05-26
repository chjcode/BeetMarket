package com.beet.beetmarket.domain.post.controller;

import com.beet.beetmarket.domain.post.dto.request.CreatePostRequestDto;
import com.beet.beetmarket.domain.post.dto.request.UpdatePostRequestDto;
import com.beet.beetmarket.domain.post.dto.request.UpdatePostStatusRequestDto;
import com.beet.beetmarket.domain.post.dto.response.CreatePostResponseDto;
import com.beet.beetmarket.domain.post.dto.response.PostDto;
import com.beet.beetmarket.domain.post.dto.response.PostListDto;
import com.beet.beetmarket.domain.post.entity.Status;
import com.beet.beetmarket.domain.post.exception.PostImageMissingException;
import com.beet.beetmarket.domain.post.service.PostService;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.global.response.ResponseWrapper;
import com.beet.beetmarket.global.response.ResponseWrapperFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<ResponseWrapper<Page<PostListDto>>> searchPost(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) Status status,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Long userId = user != null ? user.getId() : null;

        Page<PostListDto> page = postService.searchPosts(userId, keyword, category, region, status, pageable);
        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null,
                page
        );
    }

    @GetMapping("/{postId}")
    public ResponseEntity<ResponseWrapper<PostDto>> getPost(
            @AuthenticationPrincipal User user,
            @PathVariable Long postId
    ) {
        Long userId = user != null ? user.getId() : null;

        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null,
                postService.getPost(userId, postId)
        );
    }

    @PostMapping
    public ResponseEntity<ResponseWrapper<CreatePostResponseDto>> createPost(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreatePostRequestDto request) {
        if(request.images().isEmpty()) throw new PostImageMissingException();



        return ResponseWrapperFactory.setResponse(
            HttpStatus.OK,
            null,
            postService.createPost(user.getId(), request)
        );
    }

    @PatchMapping("/{postId}")
    public ResponseEntity<ResponseWrapper<Void>> updatePost(
            @AuthenticationPrincipal User user,
            @PathVariable Long postId,
            @Valid @RequestBody UpdatePostRequestDto request
    ) {
        if(request.images().isEmpty()) throw new PostImageMissingException();

        postService.updatePost(user.getId(), postId, request);

        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null
        );
    }

//    @GetMapping("/my/all")
    public ResponseEntity<ResponseWrapper<Page<PostListDto>>> getMyAllPosts(
            @AuthenticationPrincipal User user,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null,
                postService.searchAllMyPosts(user.getId(), pageable)
        );
    }

    @GetMapping("/my/favorite")
    public ResponseEntity<ResponseWrapper<Page<PostListDto>>> getMyFavoritePosts(
            @AuthenticationPrincipal User user,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null,
                postService.getFavoritePosts(user.getId(), pageable)
        );
    }

    @GetMapping("/my/buy")
    public ResponseEntity<ResponseWrapper<Page<PostListDto>>> getMyBuyingPosts(
            @AuthenticationPrincipal User user,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null,
                postService.searchAllMyBuyingPosts(user.getId(), pageable)
        );
    }

    @GetMapping("/my/sell")
    public ResponseEntity<ResponseWrapper<Page<PostListDto>>> getMySellingPosts(
            @AuthenticationPrincipal User user,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null,
                postService.searchAllMySellingPosts(user.getId(), pageable)
        );
    }

    @PutMapping("/{postId}/status")
    public ResponseEntity<ResponseWrapper<Void>> updatePostStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Long postId,
            @RequestBody UpdatePostStatusRequestDto request
    ) {
        postService.updatePostStatus(user.getId(), postId, request);
        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null,
                null
        );
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<ResponseWrapper<Void>> deletePost(
            @AuthenticationPrincipal User user,
            @PathVariable Long postId
    ) {
        postService.deletePost(user.getId(), postId);

        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null,
                null
        );
    }
}
