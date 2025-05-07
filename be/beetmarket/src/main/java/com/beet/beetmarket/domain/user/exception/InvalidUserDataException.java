package com.beet.beetmarket.domain.user.exception;

import com.beet.beetmarket.global.exception.BaseRuntimeException;
import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;

@CustomException(ExceptionCode.INVALID_USER_DATA)
public class InvalidUserDataException extends BaseRuntimeException {
}