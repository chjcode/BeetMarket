package com.beet.beetmarket.global.util.uploader.exception;

import com.beet.beetmarket.global.exception.BaseRuntimeException;
import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;

@CustomException(ExceptionCode.INVALID_IMAGE_FILE_TYPE)
public class InvalidImageFileTypeException extends BaseRuntimeException {
}
