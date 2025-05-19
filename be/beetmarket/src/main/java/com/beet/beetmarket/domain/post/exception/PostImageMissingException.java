package com.beet.beetmarket.domain.post.exception;

import com.beet.beetmarket.global.exception.BaseRuntimeException;
import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;

@CustomException(ExceptionCode.POST_IMAGE_MISSING_EXCEPTION)
public class PostImageMissingException extends BaseRuntimeException {
}
