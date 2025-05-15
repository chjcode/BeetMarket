package com.beet.beetmarket.domain.favorite.service;

import com.beet.beetmarket.domain.favorite.entity.Favorite;
import com.beet.beetmarket.domain.favorite.exception.FavoriteAlreadyExistsException;
import com.beet.beetmarket.domain.favorite.exception.FavoriteNotFoundException;
import com.beet.beetmarket.domain.favorite.repository.FavoriteRepository;
import com.beet.beetmarket.domain.post.entity.Post;
import com.beet.beetmarket.domain.post.exception.PostNotFountException;
import com.beet.beetmarket.domain.post.repository.PostRepository;
import com.beet.beetmarket.domain.post.repository.PostSearchRepository;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.domain.user.exception.UserNotFoundException;
import com.beet.beetmarket.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostSearchRepository postSearchRepository;

    @Autowired
    public FavoriteService(FavoriteRepository favoriteRepository, UserRepository userRepository, PostRepository postRepository, PostSearchRepository postSearchRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.postSearchRepository = postSearchRepository;
    }

    public void createFavorite(Long userId, Long postId) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        Post post = postRepository.findById(postId).orElseThrow(PostNotFountException::new);

        Favorite favorite = new Favorite(user, post);
        try {
            favoriteRepository.save(favorite);
        } catch (DataIntegrityViolationException e) {
            throw new FavoriteAlreadyExistsException();
        }
        postSearchRepository.changeFavoriteCount(postId, 1);
    }

    public void deleteFavorite(Long userId, Long postId) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        Post post = postRepository.findById(postId).orElseThrow(PostNotFountException::new);

        int deleted = favoriteRepository.deleteByPostAndUser(post, user);
        if (deleted == 0) {
            throw new FavoriteNotFoundException();
        }
        postSearchRepository.changeFavoriteCount(postId, -1);
    }
}
