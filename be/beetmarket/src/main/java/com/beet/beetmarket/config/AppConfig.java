package com.beet.beetmarket.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();

        requestFactory.setConnectTimeout(10000); // 연결 타임아웃 10000ms (10초)
        requestFactory.setReadTimeout(30000);    // 읽기 타임아웃 30000ms (30초)

        restTemplate.setRequestFactory(requestFactory);
        return restTemplate;
    }
}