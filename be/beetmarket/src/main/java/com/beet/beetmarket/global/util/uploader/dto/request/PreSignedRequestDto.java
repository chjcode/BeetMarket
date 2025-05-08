package com.beet.beetmarket.global.util.uploader.dto.request;

import java.util.List;

public record PreSignedRequestDto(
	String uuid,
	List<FileRequestDto> files
) { }
