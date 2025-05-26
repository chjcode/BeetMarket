package com.beet.beetmarket.global.response;

import org.springframework.http.HttpStatus;

public interface ResponseCode {
	String getCode();

	String getMessage();

	HttpStatus getHttpStatus();
}
