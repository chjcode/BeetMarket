package com.beet.beetmarket.domain.favorite.exception;

import com.beet.beetmarket.global.exception.BaseRuntimeException;
import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;

@CustomException(ExceptionCode.FAVORITE_NOT_FOUND)
public class FavoriteNotFoundException extends BaseRuntimeException {
}
