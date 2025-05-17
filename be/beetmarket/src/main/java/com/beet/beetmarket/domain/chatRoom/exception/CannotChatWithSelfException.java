package com.beet.beetmarket.domain.chatRoom.exception;

import com.beet.beetmarket.global.exception.BaseRuntimeException;
import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;

@CustomException(ExceptionCode.CANNOT_CHAT_WITH_SELF)
public class CannotChatWithSelfException extends BaseRuntimeException {
}