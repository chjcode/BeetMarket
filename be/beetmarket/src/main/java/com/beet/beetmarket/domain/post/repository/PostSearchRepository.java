package com.beet.beetmarket.domain.post.repository;

import com.beet.beetmarket.domain.post.entity.PostDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostSearchRepository
        extends ElasticsearchRepository<PostDocument, Long>,
        PostSearchRepositoryCustom {
}
