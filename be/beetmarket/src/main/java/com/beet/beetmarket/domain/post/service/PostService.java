package com.beet.beetmarket.domain.post.service;

import com.beet.beetmarket.domain.category.entity.Category;
import com.beet.beetmarket.domain.category.repository.CategoryRepository;
import com.beet.beetmarket.domain.favorite.dto.LikeInfoDto;
import com.beet.beetmarket.domain.favorite.repository.FavoriteRepository;
import com.beet.beetmarket.domain.image.entity.Image;
import com.beet.beetmarket.domain.image.repository.ImageRepository;
import com.beet.beetmarket.domain.post.dto.request.CreatePostRequestDto;
import com.beet.beetmarket.domain.post.dto.request.UpdatePostRequestDto;
import com.beet.beetmarket.domain.post.dto.response.PostDto;
import com.beet.beetmarket.domain.post.dto.response.PostListDto;
import com.beet.beetmarket.domain.post.entity.Post;
import com.beet.beetmarket.domain.post.entity.PostDocument;
import com.beet.beetmarket.domain.post.entity.Status;
import com.beet.beetmarket.domain.post.repository.PostRepository;
import com.beet.beetmarket.domain.post.repository.PostSearchRepository;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.domain.user.repository.UserRepository;
import com.beet.beetmarket.global.redis.ImageProcessPublisher;
import com.beet.beetmarket.global.redis.VideoProcessPublisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final PostSearchRepository searchRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FavoriteRepository favoriteRepository;
    private final ImageProcessPublisher imageProcessPublisher;
    private final VideoProcessPublisher videoProcessPublisher;
    private final ImageRepository imageRepository;

    @Autowired
    public PostService(
            PostRepository postRepository,
            PostSearchRepository searchRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            FavoriteRepository favoriteRepository,
            ImageProcessPublisher imageProcessPublisher,
            VideoProcessPublisher videoProcessPublisher,
            ImageRepository imageRepository) {
        this.postRepository = postRepository;
        this.searchRepository = searchRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.favoriteRepository = favoriteRepository;
        this.imageProcessPublisher = imageProcessPublisher;
        this.videoProcessPublisher = videoProcessPublisher;
        this.imageRepository = imageRepository;
    }


    public PostDto getPost(Long userId, Long postId) {
        Post post = postRepository.findByIdWithUserAndCategory(postId).orElseThrow();
        List<String> images = imageRepository.findImageUrlsByPostIdOrderBySequence(postId);
        LikeInfoDto likeInfo = favoriteRepository.fetchLikeInfo(postId, userId);

        post.viewPost();
        return PostDto.from(post, images, likeInfo.likeCount(), likeInfo.liked());
    }

    public Page<PostListDto> searchPosts(Long userId, String keyword, String category, String region, Status status, Pageable pageable) {
        Page<PostDocument> docs = searchRepository.search(keyword, category, region, status, pageable);

        List<Long> postIds = docs.stream().map(PostDocument::getId).toList();

        Set<Long> likeIds = (userId ==null || postIds.isEmpty())
        ? Collections.emptySet()
        : favoriteRepository.findLikedPostIds(userId, postIds);

        List<PostListDto> content = docs.stream()
                .map(doc -> PostListDto.from(
                        doc,
                        likeIds.contains(doc.getId())
                ))
                .toList();

        return new PageImpl<>(content, pageable, docs.getTotalElements());
    }

    public void createPost(Long userId, CreatePostRequestDto request) {
        User user = userRepository.findById(userId).orElseThrow();
        Category category = categoryRepository.findByName(request.category()).orElseThrow();
        List<Image> images = new ArrayList<>();
        Post post = Post.builder()
                .user(user)
                .category(category)
                .title(request.title())
                .content(request.content())
                .price(request.price())
                .status(Status.AVAILABLE)
                .region(request.region())
                .location(request.location())
                .imageUrls(images)
                .uuid(request.uuid())
                .build();

        for(int i = 0; i < request.images().size(); i++) {
            images.add(
                    Image.builder()
                            .post(post)
                            .imageOrigin(request.images().get(i))
                            .sequence(i).build()
            );
        }

        postRepository.save(post);

        imageProcessPublisher.publishImages(post.getId(), post.getUuid(), request.images());
        if(request.video() != null) {
            videoProcessPublisher.publishVideos(userId, post.getId(), post.getUuid(), request.video());
        }
    }

    public void updatePost(Long userId, Long postId, UpdatePostRequestDto request) {
        User user = userRepository.findById(userId).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        if(!post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException();
        }

        Category category = categoryRepository.findByName(request.category()).orElseThrow();

        List<Image> newImages = new ArrayList<>();

        for (int i = 0; i < request.images().size(); i++) {
            Image newImg = Image.builder()
                    .post(post)
                    .imageOrigin(request.images().get(i))
                    .sequence(i)
                    .build();
            newImages.add(newImg);
        }

        post.updatePost(
                category,
                request.title(),
                request.content(),
                request.price(),
                request.region(),
                request.location(),
                request.video(),
                newImages
        );

        imageProcessPublisher.publishImages(post.getId(), post.getUuid(), request.images());
        if(request.video() != null) {
            videoProcessPublisher.publishVideos(userId, post.getId(), post.getUuid(), request.video());
        }
    }
}
