package com.beet.beetmarket.domain.chat.common;

import com.beet.beetmarket.global.response.ResponseCode;
import org.springframework.http.HttpStatus;

public enum ChatResponseCode implements ResponseCode {

    CHAT_ROOM_CREATED("CHAT_001", "채팅방이 성공적으로 생성되었습니다.", HttpStatus.CREATED),
    CHAT_ROOM_FETCHED("CHAT_002", "기존 채팅방 정보를 반환합니다.", HttpStatus.OK),

    ;

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ChatResponseCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
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
        return this.httpStatus;
    }
}