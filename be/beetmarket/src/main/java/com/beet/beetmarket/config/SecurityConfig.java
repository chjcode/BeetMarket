package com.beet.beetmarket.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.beet.beetmarket.domain.user.handler.CustomOAuth2SuccessHandler;
import com.beet.beetmarket.domain.user.repository.UserRepository;
import com.beet.beetmarket.domain.user.service.CustomOAuth2UserService;
import com.beet.beetmarket.global.filter.JwtFilter;
import com.beet.beetmarket.global.jwt.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	private final CustomOAuth2UserService customOAuth2UserService;
	private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;
	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;
	private final AuthenticationEntryPoint authenticationEntryPoint;
	private final AccessDeniedHandler accessDeniedHandler;

	@Value("${front-url}")
	String frontUrl;

	@Autowired
	SecurityConfig(
		CustomOAuth2UserService customOAuth2UserService,
		CustomOAuth2SuccessHandler customOAuth2SuccessHandler,
		JwtUtil jwtUtil,
		UserRepository userRepository,
		AuthenticationEntryPoint authenticationEntryPoint,
		AccessDeniedHandler accessDeniedHandler
	) {
		this.customOAuth2UserService = customOAuth2UserService;
		this.customOAuth2SuccessHandler = customOAuth2SuccessHandler;
		this.jwtUtil = jwtUtil;
		this.userRepository = userRepository;
		this.authenticationEntryPoint = authenticationEntryPoint;
		this.accessDeniedHandler = accessDeniedHandler;
	}

	// secret encoder
	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	// user role
	@Bean
	public RoleHierarchy roleHierarchy() {
		String hierarchy = "ROLE_ADMIN > ROLE_USER";
		return RoleHierarchyImpl.fromHierarchy(hierarchy);
	}

	// cors config
	private CorsConfiguration corsConfiguration(HttpServletRequest request) {
		CorsConfiguration corsConfiguration = new CorsConfiguration();
		corsConfiguration.setAllowCredentials(true);
		corsConfiguration.addAllowedHeader("Authorization");
		corsConfiguration.addAllowedHeader("Content-Type");
		corsConfiguration.addAllowedHeader("*");
		corsConfiguration.addAllowedMethod("*");
		corsConfiguration.addAllowedOrigin(frontUrl);
		// '*' 대신 allowedOriginPatterns 사용 (와일드카드 패턴 허용)
		corsConfiguration.addAllowedOriginPattern("*");
		// "null" Origin도 허용
		corsConfiguration.addAllowedOrigin("null");
		corsConfiguration.addExposedHeader("Authorization");

		return corsConfiguration;
	}

	// secret-filter-chain
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		// default disable
		http.csrf(AbstractHttpConfigurer::disable);
		http.httpBasic(AbstractHttpConfigurer::disable);
		http.formLogin(AbstractHttpConfigurer::disable);

		// allow cors
		http.cors(cors -> cors.configurationSource(this::corsConfiguration));

		// stateless session
		http.sessionManagement((session) -> session
			.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
		);

		// OAuth2 로그인 설정 : 로그인 성공 시 사용자 정보 처리 및 성공 핸들러 지정
		/**
		 * OAuth2 로그인 설정 : 로그인 성공 시 사용자 정보 처리 및 성공 핸들러 지정
		 * application.yml에 client-id, client-secret, redirect-url과 같은 설정을 해두면
		 */
		http.oauth2Login(oauth2 -> oauth2
			.userInfoEndpoint(userInfoEndpointConfig -> userInfoEndpointConfig
				.userService(customOAuth2UserService)
			)
				.authorizationEndpoint(a -> a.baseUri("/api/oauth2/authorization"))
				.redirectionEndpoint(r -> r.baseUri("/api/oauth2/code/*"))
			.successHandler(customOAuth2SuccessHandler)
		);

		// jwt filter
		JwtFilter jwtFilter = new JwtFilter(
			jwtUtil,
			userRepository
		);
		http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

//		// logout
//		CustomLogoutFilter customLogoutFilter = new CustomLogoutFilter(tokenBlackListRepository);
//		http.addFilterBefore(customLogoutFilter, LogoutFilter.class);
//
//		// exception handling filter
//		ExceptionHandlingFilter exceptionHandlingFilter = new ExceptionHandlingFilter();
//		http.addFilterBefore(exceptionHandlingFilter, JwtFilter.class);
//
//		// handling Exception
//		http.exceptionHandling((exception) -> exception
//			.authenticationEntryPoint(authenticationEntryPoint)
//			.accessDeniedHandler(accessDeniedHandler)
//		);

		return http.build();
	}
}
