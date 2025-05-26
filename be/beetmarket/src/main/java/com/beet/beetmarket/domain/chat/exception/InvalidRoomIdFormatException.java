package com.beet.beetmarket.domain.chat.exception;

import com.beet.beetmarket.global.exception.BaseRuntimeException;
import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;

@CustomException(ExceptionCode.CHAT_INVALID_ROOM_ID_FORMAT)
public class InvalidRoomIdFormatException extends BaseRuntimeException {
}
