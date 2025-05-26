package com.beet.beetmarket.global.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.domain.user.exception.ExpiredAccessTokenException;
import com.beet.beetmarket.domain.user.exception.InvalidAccessTokenException;
import com.beet.beetmarket.domain.user.repository.UserRepository;
import com.beet.beetmarket.global.jwt.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtFilter extends OncePerRequestFilter {
	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;

	public JwtFilter(
		JwtUtil jwtUtil,
		UserRepository userRepository
	) {
		this.jwtUtil = jwtUtil;
		this.userRepository = userRepository;
	}

	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {

		String authorizationHeader = request.getHeader("Authorization");
		if (authorizationHeader == null) {
			filterChain.doFilter(request, response);
			return;
		}
		if (!authorizationHeader.startsWith("Bearer ")) {
			log.error("Authorization header is incorrect");
			throw new InvalidAccessTokenException();
		}
		String token = authorizationHeader.substring(7);
		String nickname;
		try {
			nickname = jwtUtil.getKey(token, "id");
		} catch (Exception e) {
			log.error("Invalid token");
			throw new InvalidAccessTokenException();
		}
		if (nickname == null) {
			log.error("Username is null");
			throw new InvalidAccessTokenException();
		}
		try {
			jwtUtil.isExpired(token);
		} catch (Exception e) {
			log.error("Invalid token");
			throw new ExpiredAccessTokenException();
		}
		User user = userRepository.getUserByOauthName(nickname);
		if (user == null) {
			log.error("User not found");
			throw new InvalidAccessTokenException();
		}
		SecurityContextHolder
			.getContext()
			.setAuthentication(
				new UsernamePasswordAuthenticationToken(
					user, null
				)
			);

		filterChain.doFilter(request, response);
	}
}
