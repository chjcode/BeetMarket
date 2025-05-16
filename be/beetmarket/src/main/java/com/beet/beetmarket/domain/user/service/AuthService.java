package com.beet.beetmarket.domain.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import com.beet.beetmarket.domain.user.entity.RefreshTokenEntity;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.domain.user.exception.RefreshTokenMismatchException;
import com.beet.beetmarket.domain.user.exception.RefreshTokenNotFoundException;
import com.beet.beetmarket.domain.user.exception.UserNotFoundException;
import com.beet.beetmarket.domain.user.repository.RefreshTokenRepository;
import com.beet.beetmarket.domain.user.repository.UserRepository;
import com.beet.beetmarket.global.jwt.JwtUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AuthService {
	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;
	private final RefreshTokenRepository refreshTokenRepository;

	@Autowired
	public AuthService(JwtUtil jwtUtil, UserRepository userRepository, RefreshTokenRepository refreshTokenRepository) {
		this.jwtUtil = jwtUtil;
		this.userRepository = userRepository;
		this.refreshTokenRepository = refreshTokenRepository;
	}

	// refreshToken이 유효한지 확인하고 헤더에 "Authorization"이라는 키로 accessToken을 발급함.
	// refreshToken이 유효한지 확인하고 db에 있는 토큰인지 확인하고
	// "Authorization"이라는 키로 accessToken과 refreshToken을 발급함.
	public HttpHeaders setAccessToken(String token) {
		String oauthName = jwtUtil.getKey(token, "id");	// jwt 토큰에서 user의 아이디 가져옴

		// Redis에서 저장된 refreshTokenEntity 조회 (없으면 예외 발생)
		RefreshTokenEntity refreshTokenEntity = refreshTokenRepository.findById(oauthName)
			.orElseThrow(() -> new RefreshTokenNotFoundException());

		// 저장된 토큰과 전달받은 토큰이 일치하는지 확인
		if (!refreshTokenEntity.getRefreshToken().equals(token)) {
			throw new RefreshTokenMismatchException();	// 추후 더 디테일한 exception으로 수정
		}

		User user = userRepository.getUserByOauthName(oauthName);	// db에서 nickname으로 조회
		if (user == null) {	//user 없으면 exception
			throw new UserNotFoundException();
		}

		// access token , refresh token 갱신
		String accessToken = jwtUtil.generateToken(user, 24 * 60 * 60 * 1000L);
		String refreshToken = jwtUtil.generateToken(user, 30 * 24 * 60 * 60 * 1000L);
		refreshTokenEntity.updateToken(refreshToken);
		refreshTokenRepository.save(refreshTokenEntity);

		System.out.println(accessToken);
		ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
			.path("/")
			.httpOnly(true)
			.secure(true)
			.sameSite("None")
			.build();

		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
		headers.set("Authorization", "Bearer " + accessToken);

		return headers;
	}

	public String getUserNicknameByToken(String token) {
		String oauthName = jwtUtil.getKey(token, "id");	// jwt 토큰에서 user의 아이디 가져옴

		User user = userRepository.getUserByOauthName(oauthName);
		return user.getNickname();
	}
}
