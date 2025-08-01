package com.beet.beetmarket.domain.post.repository;

import com.beet.beetmarket.domain.post.entity.PostDocument;
import com.beet.beetmarket.domain.post.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostSearchRepositoryCustom {
    Page<PostDocument> search(
            String keyword,
            String categoryName,
            String region,
            Status status,
            Pageable pageable
    );

    void updateViewInEs(Long postId, Long newView);
    void changeFavoriteCount(Long postId, int delta);
    void updateStatusAndBuyerInEs(Long postId, Status status, Long buyerId);
    List<PostDocument> findByIds(List<Long> ids);
}
