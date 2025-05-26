package com.beet.beetmarket.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.minio.MinioClient;

@Configuration
public class MinioConfig {

	@Value("${spring.minio.url}")
	private String url;

	@Value("${spring.minio.access-key}")
	private String accessKey;

	@Value("${spring.minio.secret-key}")
	private String secretKey;

	@Value("${spring.minio.bucket-name}")
	private String bucketName;

	@Bean
	public MinioClient minioClient() {
		return MinioClient.builder()
			.endpoint(url)
			.credentials(accessKey, secretKey)
			.build();
	}

	public String getBucketName() {
		return bucketName;
	}

	public String getUrl() {
		return url;
	}
}
