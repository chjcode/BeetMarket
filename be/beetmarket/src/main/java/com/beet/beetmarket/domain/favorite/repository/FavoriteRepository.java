package com.beet.beetmarket.domain.favorite.repository;

import com.beet.beetmarket.domain.favorite.dto.LikeInfoDto;
import com.beet.beetmarket.domain.favorite.entity.Favorite;
import com.beet.beetmarket.domain.post.entity.Post;
import com.beet.beetmarket.domain.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    @Query("""
        SELECT f.post.id
        FROM Favorite f
        WHERE f.user.id = :userId
        AND f.post.id IN :postIds
        """)
    Set<Long> findLikedPostIds(
            Long userId,
            List<Long> postIds
    );

    @Query("""
        SELECT new com.beet.beetmarket.domain.favorite.dto.LikeInfoDto(
            count(f),
            (sum(case when f.user.id = :userId then 1 else 0 end) > 0)
        )
        FROM Favorite f
        WHERE f.post.id = :postId
    """)
    LikeInfoDto fetchLikeInfo(Long postId, Long userId);

    long countByPostId(Long postId);

    int deleteByPostAndUser(Post post, User user);

    @Query("SELECT f.post.id FROM Favorite f WHERE f.user.id = :userId")
    List<Long> findPostIdsByUserId(Long userId, Pageable pageable);

    long countByUserId(Long userId);

    void deleteByPost(Post post);
}
