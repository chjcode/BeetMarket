package com.beet.beetmarket.domain.user.exception;

import com.beet.beetmarket.global.exception.BaseRuntimeException;
import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;

@CustomException(ExceptionCode.NICKNAME_ALREADY_TAKEN)
public class NicknameAlreadyTakenException extends BaseRuntimeException {
}