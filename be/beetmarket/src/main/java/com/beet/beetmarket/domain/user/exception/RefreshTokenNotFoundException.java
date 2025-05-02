package com.beet.beetmarket.domain.user.exception;


import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;

@CustomException(ExceptionCode.REFRESH_TOKEN_NOT_FOUND)
public class RefreshTokenNotFoundException extends RuntimeException {
}
