package com.beet.beetmarket.domain.post.repository;

import com.beet.beetmarket.domain.post.entity.PostDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostSearchRepository
        extends ElasticsearchRepository<PostDocument, Long>,
        PostSearchRepositoryCustom {

    Page<PostDocument> findByAuthorId(Long authorId, Pageable pageable);
    Page<PostDocument> findByBuyerId(Long buyerId, Pageable pageable);
    Page<PostDocument> findByAuthorIdOrBuyerId(Long authorId, Long buyerId, Pageable pageable);

    List<PostDocument> findByAuthorNickname(String nickname);
}
