package com.beet.beetmarket.domain.post.exception;

import com.beet.beetmarket.global.exception.BaseRuntimeException;
import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;

@CustomException(ExceptionCode.POST_ALREADY_COMPLETED)
public class PostAlreadyCompletedException extends BaseRuntimeException {
}