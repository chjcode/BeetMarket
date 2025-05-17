package com.beet.beetmarket.domain.chat.exception;

import com.beet.beetmarket.global.exception.BaseRuntimeException;
import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;

@CustomException(ExceptionCode.CHAT_ROOM_NOT_FOUND)
public class ChatRoomNotFoundException extends BaseRuntimeException {
}
