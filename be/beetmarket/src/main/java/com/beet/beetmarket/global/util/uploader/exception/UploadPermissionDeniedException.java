package com.beet.beetmarket.global.util.uploader.exception;

import com.beet.beetmarket.global.exception.BaseRuntimeException;
import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;

@CustomException(ExceptionCode.PRESIGNED_URL_GENERATION_FAILED)
public class UploadPermissionDeniedException extends BaseRuntimeException {
}
