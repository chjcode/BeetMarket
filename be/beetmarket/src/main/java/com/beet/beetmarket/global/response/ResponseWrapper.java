package com.beet.beetmarket.global.response;


import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ResponseWrapper<T>(
	Status status,
	T content
) {
	public record Status(
		String code,
		String message
	) { }

	public ResponseWrapper(
		ResponseCode responseCode,
		T content
	) {
		this(
			new Status(
				responseCode.getCode(),
				responseCode.getMessage()
			),
			content
		);
	}
}
