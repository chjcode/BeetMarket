package com.beet.beetmarket.domain.post.service;

import com.beet.beetmarket.domain.category.entity.Category;
import com.beet.beetmarket.domain.category.exception.CategoryNotFoundException;
import com.beet.beetmarket.domain.category.repository.CategoryRepository;
import com.beet.beetmarket.domain.chatRoom.entity.ChatRoom;
import com.beet.beetmarket.domain.chatRoom.repository.ChatRoomRepository;
import com.beet.beetmarket.domain.favorite.repository.FavoriteRepository;
import com.beet.beetmarket.domain.image.entity.Image;
import com.beet.beetmarket.domain.image.repository.ImageRepository;
import com.beet.beetmarket.domain.post.dto.request.CreatePostRequestDto;
import com.beet.beetmarket.domain.post.dto.request.UpdatePostRequestDto;
import com.beet.beetmarket.domain.post.dto.request.UpdatePostStatusRequestDto;
import com.beet.beetmarket.domain.post.dto.response.CreatePostResponseDto;
import com.beet.beetmarket.domain.post.dto.response.PostDto;
import com.beet.beetmarket.domain.post.dto.response.PostListDto;
import com.beet.beetmarket.domain.post.entity.Post;
import com.beet.beetmarket.domain.post.entity.PostDocument;
import com.beet.beetmarket.domain.post.entity.Status;
import com.beet.beetmarket.domain.post.exception.PostAccessDeniedException;
import com.beet.beetmarket.domain.post.exception.PostNotFountException;
import com.beet.beetmarket.domain.post.mapper.PostMapper;
import com.beet.beetmarket.domain.post.repository.PostRepository;
import com.beet.beetmarket.domain.post.repository.PostSearchRepository;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.domain.user.exception.UserNotFoundException;
import com.beet.beetmarket.domain.user.repository.UserRepository;
import com.beet.beetmarket.global.redis.ImageProcessPublisher;
import com.beet.beetmarket.global.redis.VideoProcessPublisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

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
    private final StringRedisTemplate redisTemplate;
    private final ChatRoomRepository chatRoomRepository;

    private static final String REDIS_VIEW_PREFIX = "post:view:";

    @Autowired
    public PostService(
            PostRepository postRepository,
            PostSearchRepository searchRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            FavoriteRepository favoriteRepository,
            ImageProcessPublisher imageProcessPublisher,
            VideoProcessPublisher videoProcessPublisher,
            ImageRepository imageRepository,
            StringRedisTemplate redisTemplate, ChatRoomRepository chatRoomRepository) {
        this.postRepository = postRepository;
        this.searchRepository = searchRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.favoriteRepository = favoriteRepository;
        this.imageProcessPublisher = imageProcessPublisher;
        this.videoProcessPublisher = videoProcessPublisher;
        this.imageRepository = imageRepository;
        this.redisTemplate = redisTemplate;
        this.chatRoomRepository = chatRoomRepository;
    }


    public PostDto getPost(Long userId, Long postId) {
        Post post = postRepository.findByIdWithUserAndCategory(postId).orElseThrow(PostNotFountException::new);
        List<String> images = imageRepository.findImageUrlsByPostIdOrderBySequence(postId);
//        LikeInfoDto likeInfo = favoriteRepository.fetchLikeInfo(postId, userId);
        Long favoriteCount = favoriteRepository.countByPostId(postId);
        Boolean myFavorite = favoriteRepository.findByPostIdAndUserId(postId, userId).isPresent();
        String key = REDIS_VIEW_PREFIX + postId;
        Long view = redisTemplate.opsForValue().increment(key);

        searchRepository.updateViewInEs(postId, view);

        return PostDto.from(
                post,
                images,
                view,
                favoriteCount,
                myFavorite
//                likeInfo.likeCount(),
//                likeInfo.liked()
        );
    }

    public Page<PostListDto> searchPosts(Long userId, String keyword, String category, String region, Status status, Pageable pageable) {
        Page<PostDocument> docs = searchRepository.search(keyword, category, region, status, pageable);

        List<Long> postIds = docs.stream().map(PostDocument::getId).toList();

        Set<Long> likeIds = (userId == null || postIds.isEmpty())
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

    public Page<PostListDto> searchAllMyPosts(Long userId, Pageable pageable) {
        Page<PostDocument> docs = searchRepository.findByAuthorIdOrBuyerId(userId, userId, pageable);

        List<PostListDto> content = docs.stream()
                .map(doc -> PostListDto.from(doc, null))
                .toList();

        return new PageImpl<>(content, pageable, docs.getTotalElements());
    }

    public Page<PostListDto> searchAllMyBuyingPosts(Long userId, Pageable pageable) {
        Page<PostDocument> docs = searchRepository.findByBuyerId(userId, pageable);

        List<PostListDto> content = docs.stream()
                .map(doc -> PostListDto.from(doc, null))
                .toList();

        return new PageImpl<>(content, pageable, docs.getTotalElements());
    }
    public Page<PostListDto> searchAllMySellingPosts(Long userId, Pageable pageable) {
        Page<PostDocument> docs = searchRepository.findByAuthorId(userId, pageable);

        List<PostListDto> content = docs.stream()
                .map(doc -> PostListDto.from(doc, null))
                .toList();

        return new PageImpl<>(content, pageable, docs.getTotalElements());
    }



    public CreatePostResponseDto createPost(Long userId, CreatePostRequestDto request) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        Category category = categoryRepository.findByName(request.category()).orElseThrow(CategoryNotFoundException::new);
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
                .videoUrl(request.video())
                .uuid(request.uuid())
                .latitude(request.latitude())
                .longitude(request.longitude())
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

        PostDocument document = PostMapper.toDocument(post, 0L);
        searchRepository.save(document);

        imageProcessPublisher.publishImages(post.getId(), post.getUuid(), request.images());
        if(request.video() != null) {
            videoProcessPublisher.publishVideos(userId, post.getId(), post.getUuid(), request.video());
        }

        return new CreatePostResponseDto(post.getId());
    }

    public void updatePost(Long userId, Long postId, UpdatePostRequestDto request) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        Post post = postRepository.findById(postId).orElseThrow(PostNotFountException::new);
        if(!post.getUser().getId().equals(user.getId())) {
            throw new PostAccessDeniedException();
        }

        Category category = categoryRepository.findByName(request.category()).orElseThrow(CategoryNotFoundException::new);

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
                newImages,
                request.latitude(),
                request.longitude()
        );

        long likeCount = favoriteRepository.countByPostId(postId);
        PostDocument document = PostMapper.toDocument(post, likeCount);

        searchRepository.save(document);

        imageProcessPublisher.publishImages(post.getId(), post.getUuid(), request.images());
        if(request.video() != null) {
            videoProcessPublisher.publishVideos(userId, post.getId(), post.getUuid(), request.video());
        }
    }

    public void updatePostStatus(Long id, Long postId, UpdatePostStatusRequestDto request) {
        User user = userRepository.findById(id).orElseThrow(UserNotFoundException::new);
        Post post = postRepository.findById(postId).orElseThrow(PostNotFountException::new);
        if(!post.getUser().getId().equals(user.getId())) {
            throw new PostAccessDeniedException();
        }
        User buyer = null;
        if(request.status() == Status.COMPLETED) {
            buyer = userRepository.findByNickname(request.buyerNickname()).orElseThrow(UserNotFoundException::new);
        }

        post.changeStatus(request.status(), buyer);

        Long buyerId = buyer != null ? buyer.getId() : null;

        searchRepository.updateStatusAndBuyerInEs(postId, request.status(), buyerId);


    }

    public Page<PostListDto> getFavoritePosts(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

        List<Long> postIds = favoriteRepository.findPostIdsByUserId(userId, pageable);

        List<PostDocument> documents = searchRepository.findByIds(postIds);

        Map<Long, PostDocument> docMap = documents.stream()
                .collect(Collectors.toMap(PostDocument::getId, d -> d));

        List<PostListDto> dtoList = postIds.stream()
                .map(id -> {
                    PostDocument doc = docMap.get(id);
                    return doc != null ? PostListDto.from(doc, true) : null;
                })
                .filter(Objects::nonNull)
                .toList();

        long total = favoriteRepository.countByUserId(userId); // count 쿼리 따로

        return new PageImpl<>(dtoList, pageable, total);
    }

    public void deletePost(Long id, Long postId) {
        User user = userRepository.findById(id).orElseThrow(UserNotFoundException::new);
        Post post = postRepository.findById(postId).orElseThrow(PostNotFountException::new);

        if(!post.getUser().getId().equals(user.getId())) {
            throw new PostAccessDeniedException();
        }

        favoriteRepository.deleteByPost(post);
        imageRepository.deleteByPost(post);
        List<ChatRoom> chatRooms = chatRoomRepository.findAllByPost(post);
        for(ChatRoom chatRoom : chatRooms) {
            chatRoom.setPost(null);
        }

        searchRepository.deleteById(postId);
        postRepository.delete(post);
    }
}
