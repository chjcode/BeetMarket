package com.beet.beetmarket.domain.favorite.exception;

import com.beet.beetmarket.global.exception.BaseRuntimeException;
import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;

@CustomException(ExceptionCode.FAVORITE_ALREADY_EXISTS)
public class FavoriteAlreadyExistsException extends BaseRuntimeException {
}
