package com.beet.beetmarket.domain.post.repository;

import co.elastic.clients.elasticsearch._types.SortOptions;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import com.beet.beetmarket.domain.post.entity.PostDocument;
import com.beet.beetmarket.domain.post.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.document.Document;

import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.ScriptType;
import org.springframework.data.elasticsearch.core.query.UpdateQuery;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;


@Repository
public class PostSearchRepositoryImpl implements PostSearchRepositoryCustom {
    private final ElasticsearchOperations ops;
    private static final IndexCoordinates INDEX = IndexCoordinates.of("posts");

    public PostSearchRepositoryImpl(ElasticsearchOperations ops) {
        this.ops = ops;
    }

    @Override
    public Page<PostDocument> search(
            String keyword,
            String categoryName,
            String region,
            Status status,
            Pageable pageable
    ) {
        boolean hasKeyword = StringUtils.hasText(keyword);
        boolean hasCategoryName = StringUtils.hasText(categoryName);
        boolean hasRegion = StringUtils.hasText(region);
        boolean hasStatus = status != null;


        Query baseQuery;
        // 검색어가 있으면 조건 추가
        if(hasKeyword || hasCategoryName || hasRegion || hasStatus) {
            baseQuery = BoolQuery.of(b -> {
                if(hasKeyword) {
                    b.must(m -> m.multiMatch(mm -> mm
                            .query(keyword)
                            .fields("title", "content")
                    ));
                }
                if(hasCategoryName) {
                    b.filter(f -> f.term(t -> t
                            .field("categoryName")
                            .value(categoryName)
                    ));
                }
                if(hasRegion) {
                    b.filter(f -> f.term(t -> t
                            .field("region")
                            .value(region)
                    ));
                }
                if(hasStatus) {
                    b.filter(f -> f.term(t -> t
                            .field("status")
                            .value(status.name())
                    ));
                }

                return b;
            })._toQuery();
        } else {
            baseQuery = Query.of(q -> q.matchAll(ma -> ma));
        }


        NativeQueryBuilder builder = new NativeQueryBuilder()
                .withQuery(baseQuery)
                .withPageable(pageable);

        // 정렬조건 있으면 추가
        if(pageable.getSort().isSorted()) {
            List<SortOptions> sorts = pageable.getSort().stream()
                    .map(order -> SortOptions.of(so -> so
                            .field(f -> f
                                    .field(order.getProperty())
                                    .order(order.isAscending()
                                            ? SortOrder.Asc
                                            :SortOrder.Desc)
                            )
                    ))
                    .toList();
            builder.withSort(sorts);
        }

        NativeQuery nativeQuery = builder.build();

        // 쿼리 실행 후 페이지로 반환
        SearchHits<PostDocument> hits = ops.search(nativeQuery, PostDocument.class);
        List<PostDocument> docs = hits.stream()
                .map(SearchHit::getContent)
                .toList();
        long total = hits.getTotalHits();

        return new PageImpl<>(docs, pageable, total);
    }

    @Override
    public void updateViewInEs(Long postId, Long newView) {
        Document doc = Document.from(Map.of("viewCount", newView));

        UpdateQuery uq = UpdateQuery.builder(postId.toString())
                .withDocument(doc)
                .build();

        ops.update(uq, INDEX);
    }

    @Override
    public void changeFavoriteCount(Long postId, int delta) {
        UpdateQuery uq = UpdateQuery.builder(postId.toString())
                .withScriptType(ScriptType.INLINE)
                .withScript("ctx._source.favoriteCount = Math.max(0, ctx._source.favoriteCount + params.delta)")
                .withLang("painless")
                .withParams(Map.of("delta", delta))
                .build();

        ops.update(uq, INDEX);
    }
}
