package com.beet.beetmarket.domain.user.exception;

import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;

@CustomException(ExceptionCode.REFRESH_TOKEN_MISMATCH)
public class RefreshTokenMismatchException extends RuntimeException {
}