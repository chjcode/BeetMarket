package com.beet.beetmarket.domain.post.repository;

import com.beet.beetmarket.domain.post.entity.Post;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @EntityGraph(attributePaths = {"user", "category"})
    @Query("SELECT p FROM Post p WHERE p.id = :id")
    Optional<Post> findByIdWithUserAndCategory(Long id);
}
