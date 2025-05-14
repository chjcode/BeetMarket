package com.beet.beetmarket.domain.image.repository;

import com.beet.beetmarket.domain.image.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    @Query("""
        SELECT i.imageOrigin
        FROM Image i
        WHERE i.post.id = :postId
        ORDER BY i.sequence
    """)
    List<String> findImageUrlsByPostIdOrderBySequence(Long postId);

    Image findByImageOrigin(String imageOrigin);
}
