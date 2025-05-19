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
	NICKNAME_ALREADY_TAKEN("user-400-3", "이미 사용 중인 닉네임입니다", HttpStatus.BAD_REQUEST),

	CATEGORY_NOT_FOUND("category-404-1", "해당 카테고리를 찾을 수 없습니다", HttpStatus.NOT_FOUND),

	INVALID_FILE_TYPE("file-400-1", "허용되지 않은 파일 형식입니다. ", HttpStatus.BAD_REQUEST),
	INVALID_IMAGE_FILE_TYPE("file-400-2", "이미지에 허용되지 않은 파일 형식입니다. ", HttpStatus.BAD_REQUEST),
	INVALID_VIDEO_FILE_TYPE("file-400-3", "동영상에 허용되지 않은 파일 형식입니다. ", HttpStatus.BAD_REQUEST),
	PRESIGNED_URL_GENERATION_FAILED("file-500-1", "Presigned URL 생성에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),

	POST_IMAGE_MISSING_EXCEPTION("post-400-1", "게시글에는 이미지가 1장 이상 포함되어야 합니다.", HttpStatus.BAD_REQUEST),
	POST_ALREADY_COMPLETED("post-400-2", "이미 판매 완료된 게시글이므로 예약할 수 없습니다.", HttpStatus.BAD_REQUEST),
	POST_ACCESS_DENIED("post-403-1", "게시글에 대한 수정/삭제 권한이 없습니다", HttpStatus.FORBIDDEN),
	POST_NOT_FOUND("post-404-1", "해당 게시글을 찾을 수 없습니다", HttpStatus.NOT_FOUND),


	FAVORITE_ALREADY_EXISTS("favorite-400-1", "이미 좋아요를 누른 게시글입니다", HttpStatus.BAD_REQUEST),
	FAVORITE_NOT_FOUND("favorite-404-1", "좋아요를 찾을 수 없습니다", HttpStatus.NOT_FOUND),

	CHAT_INVALID_ROOM_ID_FORMAT("chat-400-1", "올바르지 않은 채팅방 ID 형식입니다.", HttpStatus.BAD_REQUEST),
	CANNOT_CHAT_WITH_SELF("chat-400-2", "자기 자신과는 채팅할 수 없습니다.", HttpStatus.BAD_REQUEST),
	CHAT_ROOM_NOT_FOUND("chat-404-1", "해당 채팅방을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	CHAT_ROOM_PARTICIPANTS_INVALID("chat-500-1", "채팅방 참여자 정보가 유효하지 않습니다. (판매자 또는 구매자 정보 누락)", HttpStatus.INTERNAL_SERVER_ERROR),
	CHAT_USER_NOT_PARTICIPANT("chat-403-1", "해당 채팅방의 참여자가 아닙니다.", HttpStatus.FORBIDDEN);

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
