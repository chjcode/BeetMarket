package com.beet.beetmarket.domain.favorite.entity;

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
        AND f.post.id IN :postId
        """)
    Set<Long> findLikedPostIds(
            Long userId,
            List<Long> postIds
    );
}
