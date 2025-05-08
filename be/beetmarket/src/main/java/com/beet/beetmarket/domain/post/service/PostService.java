package com.beet.beetmarket.domain.post.service;

import com.beet.beetmarket.domain.category.entity.Category;
import com.beet.beetmarket.domain.category.repository.CategoryRepository;
import com.beet.beetmarket.domain.image.entity.Image;
import com.beet.beetmarket.domain.post.dto.request.CreatePostRequestDto;
import com.beet.beetmarket.domain.post.dto.request.UpdatePostRequestDto;
import com.beet.beetmarket.domain.post.dto.response.PostDto;
import com.beet.beetmarket.domain.post.entity.Post;
import com.beet.beetmarket.domain.post.entity.Status;
import com.beet.beetmarket.domain.post.repository.PostRepository;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public PostService(PostRepository postRepository, UserRepository userRepository, CategoryRepository categoryRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }


    public PostDto getPost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow();

        return PostDto.from(post);
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

    }
}
