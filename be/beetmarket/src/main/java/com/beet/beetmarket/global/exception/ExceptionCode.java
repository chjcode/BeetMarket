package com.beet.beetmarket.global.exception;

import org.springframework.http.HttpStatus;

import com.beet.beetmarket.global.response.ResponseCode;

public enum ExceptionCode implements ResponseCode {
	// User
	INVALID_ACCESS_TOKEN("user-401-1", "올바르지 않은 토큰입니다", HttpStatus.UNAUTHORIZED),
	EXPIRED_ACCESS_TOKEN("user-401-2", "토큰의 유효기간이 만료되었습니다", HttpStatus.UNAUTHORIZED),
	REFRESH_TOKEN_NOT_FOUND("user-401-3", "리프레시 토큰이 없습니다", HttpStatus.UNAUTHORIZED),
	REFRESH_TOKEN_MISMATCH("user-401-4", "리프레시 토큰이 일치하지 않습니다", HttpStatus.UNAUTHORIZED),
	FAIL_TO_LOGIN("user-401-5", "로그인에 실패했습니다", HttpStatus.UNAUTHORIZED),
	METHOD_UNAUTHORIZED("user-401-6", "API에 접근하기 위해서 인증이 필요합니다", HttpStatus.UNAUTHORIZED),
	METHOD_FORBIDDEN("user-403-1", "API에 접근하기 위한 권한이 부족합니다", HttpStatus.FORBIDDEN),
	USER_NOT_FOUND("user-404-2", "해당 사용자를 찾을 수 없습니다", HttpStatus.NOT_FOUND),
	USER_ALREADY_EXISTS("user-400-1", "이미 존재하는 사용자입니다", HttpStatus.BAD_REQUEST),
	INVALID_USER_DATA("user-400-2", "잘못된 사용자 데이터입니다", HttpStatus.BAD_REQUEST),
	NICKNAME_ALREADY_TAKEN("user-400-3", "이미 사용 중인 닉네임입니다", HttpStatus.BAD_REQUEST);

	private String code;
	private String message;
	private HttpStatus status;

	ExceptionCode(String code, String message, HttpStatus status) {
		this.code = code;
		this.message = message;
		this.status = status;
	}

	@Override
	public String getCode() {
		return this.code;
	}

	@Override
	public String getMessage() {
		return this.message;
	}

	@Override
	public HttpStatus getHttpStatus() {
		return this.status;
	}
}
