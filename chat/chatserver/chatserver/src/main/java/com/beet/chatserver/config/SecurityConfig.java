package com.beet.chatserver.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.beet.chatserver.global.jwt.JwtUtil;
//import com.beet.chatserver.global.jwt.filter.JwtFilter;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            .sessionManagement(sm -> sm
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .formLogin(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()
                .requestMatchers(
                    "/ws-chat/**",
                    "/api/chat-health"
                ).permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        System.out.println("<<<<<< corsConfigurationSource 빈이 생성되고 사용되는지 확인 >>>>>>");
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
            "https://k12a307.p.ssafy.io",       // 프론트엔드가 표준 HTTPS 포트(443)를 사용할 경우
            "https://k12a307.p.ssafy.io:*",    // 프론트엔드가 k12a307.p.ssafy.io 호스트의 특정 비표준 포트(예: :80)를 포함한 모든 포트를 사용할 경우
            "http://localhost:*",
            "http://127.0.0.1:*"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // WebSocket 핸드셰이크 엔드포인트에만 적용하려면 "/ws-chat/**"
//        source.registerCorsConfiguration("/ws-chat/**", config);
        // 필요하다면 REST API에도 전역 적용
        source.registerCorsConfiguration("/**", config);
        return source;
    }


}