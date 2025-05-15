package com.beet.beetmarket.domain.category.exception;

import com.beet.beetmarket.global.exception.BaseRuntimeException;
import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;

@CustomException(ExceptionCode.CATEGORY_NOT_FOUND)
public class CategoryNotFoundException extends BaseRuntimeException {
}
