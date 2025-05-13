package com.beet.beetmarket.domain.post.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDateTime;

@Document(indexName = "posts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDocument {

    @Id
    private Long id;

    @Field(type = FieldType.Text, analyzer = "nori", searchAnalyzer = "nori")
    private String title;

    @Field(type = FieldType.Text, analyzer = "nori", searchAnalyzer = "nori")
    private String content;

    @Field(type = FieldType.Keyword)
    private String authorNickname;

    @Field(type = FieldType.Keyword)
    private String categoryName;

    @Field(type = FieldType.Integer)
    private Integer price;

    @Field(type = FieldType.Keyword)
    private String region;

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private LocalDateTime createdAt;

    @Field(type = FieldType.Keyword)
    private String thumbnailUrl;

    @Field(type = FieldType.Long)
    private Long viewCount;

    @Field(type = FieldType.Long)
    private Long favoriteCount;

    @Field(type = FieldType.Keyword)
    private String status;

}
