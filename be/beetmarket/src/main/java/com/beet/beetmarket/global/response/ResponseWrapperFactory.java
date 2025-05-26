package com.beet.beetmarket.global.response;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletResponse;

public class ResponseWrapperFactory<T> {
	private final ResponseCode responseCode;
	private final HttpHeaders httpHeaders;
	private final ResponseWrapper<T> responseWrapper;

	private ResponseWrapperFactory(
		ResponseCode responseCode,
		HttpHeaders httpHeaders,
		T content
	) {
		this.responseCode = responseCode;
		this.httpHeaders = defaultHeaders(httpHeaders);
		this.responseWrapper = new ResponseWrapper<>(responseCode, content);
	}

	// 항상 들어가는 Header 삽입 후 생성자 선언
	private HttpHeaders defaultHeaders(HttpHeaders httpHeaders) {
		if (httpHeaders == null) {
			httpHeaders = new HttpHeaders();
		}

		// Default Headers
		httpHeaders.add("Content-Type", "application/json; charset=utf-8");
		httpHeaders.add("Accept", "application/json");
		httpHeaders.add("Link", String.format("<%s>; rel=\"profile\"", "APIDOG Shared docs Link"));

		return httpHeaders;
	}

	// ResponseEntity 로 응답하기 위해 Wrapping 된 객체를 타입으로 생성
	private ResponseEntity<ResponseWrapper<T>> createResponseEntity() {
		return new ResponseEntity<>(this.responseWrapper, this.httpHeaders, this.responseCode.getHttpStatus());
	}

	// Filter 에서 Exception 발생 시 @RestControllerAdvice 에서 처리 하지 못하므로 직접 처리를 해야할 떄 사용됨
	private void setHttpServletResponse(HttpServletResponse response) throws IOException {
		// set HTTP status
		response.setStatus(this.responseCode.getHttpStatus().value());

		// set Header
		for (String key : this.httpHeaders.keySet()) {
			for (String value : this.httpHeaders.get(key)) {
				response.addHeader(key, value);
			}
		}

		// set Body
		PrintWriter printWriter = response.getWriter();
		ObjectMapper objectMapper = new ObjectMapper();
		printWriter.write(objectMapper.writeValueAsString(this.responseWrapper));
		printWriter.flush();
		printWriter.close();
	}

	// OverLoading - setResponse > ResponseEntity (Enum + Content)
	public static <E> ResponseEntity<ResponseWrapper<E>> setResponse(
		ResponseCode responseCode,
		HttpHeaders httpHeaders,
		E content
	) {
		return new ResponseWrapperFactory<>(
			responseCode,
			httpHeaders,
			content
		).createResponseEntity();
	}

	// OverLoading - setResponse > ResponseEntity (Enum)
	public static <E> ResponseEntity<ResponseWrapper<E>> setResponse(
		HttpStatus httpStatus,
		HttpHeaders httpHeaders,
		E content
	) {
		return new ResponseWrapperFactory<>(
			DefaultResponseCode.of(httpStatus),
			httpHeaders,
			content
		).createResponseEntity();
	}

	// OverLoading - setResponse > ResponseEntity (HttpStatus + Content)
	public static ResponseEntity<ResponseWrapper<Void>> setResponse(
		ResponseCode responseCode,
		HttpHeaders httpHeaders
	) {
		return new ResponseWrapperFactory<Void>(
			responseCode,
			httpHeaders,
			null
		).createResponseEntity();
	}

	// OverLoading - setResponse > ResponseEntity (HttpStatus)
	public static ResponseEntity<ResponseWrapper<Void>> setResponse(
		HttpStatus httpStatus,
		HttpHeaders httpHeaders
	) {
		return new ResponseWrapperFactory<Void>(
			DefaultResponseCode.of(httpStatus),
			httpHeaders,
			null
		).createResponseEntity();
	}

	// OverLoading - setResponse > HttpServletResponse (Enum + Content)
	public static <E> void setResponse(
		HttpServletResponse response,
		ResponseCode responseCode,
		HttpHeaders httpHeaders,
		E content
	) throws IOException {
		new ResponseWrapperFactory<>(
			responseCode,
			httpHeaders,
			content
		).setHttpServletResponse(response);
	}

	// OverLoading - setResponse > HttpServletResponse (Enum)
	public static <E> void setResponse(
		HttpServletResponse response,
		HttpStatus httpStatus,
		HttpHeaders httpHeaders,
		E content
	) throws IOException {
		new ResponseWrapperFactory<>(
			DefaultResponseCode.of(httpStatus),
			httpHeaders,
			content
		).setHttpServletResponse(response);
	}

	// OverLoading - setResponse > HttpServletResponse (HttpStatus + Content)
	public static <E> void setResponse(
		HttpServletResponse response,
		ResponseCode responseCode,
		HttpHeaders httpHeaders
	) throws IOException {
		new ResponseWrapperFactory<Void>(
			responseCode,
			httpHeaders,
			null
		).setHttpServletResponse(response);
	}

	// OverLoading - setResponse > HttpServletResponse (HttpStatus)
	public static <E> void setResponse(
		HttpServletResponse response,
		HttpStatus httpStatus,
		HttpHeaders httpHeaders
	) throws IOException {
		new ResponseWrapperFactory<Void>(
			DefaultResponseCode.of(httpStatus),
			httpHeaders,
			null
		).setHttpServletResponse(response);
	}
}
