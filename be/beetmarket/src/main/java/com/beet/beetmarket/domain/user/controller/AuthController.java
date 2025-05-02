package com.beet.beetmarket.domain.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.beet.beetmarket.domain.user.service.AuthService;
import com.beet.beetmarket.global.response.ResponseWrapper;
import com.beet.beetmarket.global.response.ResponseWrapperFactory;


@RestController
public class AuthController {
	private final AuthService authService;

	@Autowired
	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@GetMapping("/auth/issue")
	public ResponseEntity<ResponseWrapper<Void>> issue(
		@CookieValue("refreshToken") String token
	) {
		return ResponseWrapperFactory.setResponse(HttpStatus.OK,
			authService.setAccessToken(token));
	}
}
