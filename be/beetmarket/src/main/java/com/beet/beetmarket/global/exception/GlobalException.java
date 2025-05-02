package com.beet.beetmarket.global.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.beet.beetmarket.global.response.ResponseWrapper;
import com.beet.beetmarket.global.response.ResponseWrapperFactory;

@RestControllerAdvice
public class GlobalException {

	@ExceptionHandler({BaseException.class, BaseRuntimeException.class})
	public ResponseEntity<ResponseWrapper<Void>> handleException(Exception exception) {
		CustomException customException = exception.getClass().getAnnotation(CustomException.class);

		ExceptionCode exceptionCode = customException.value();

		return ResponseWrapperFactory.setResponse(
			exceptionCode,
			null
		);
	}
}
