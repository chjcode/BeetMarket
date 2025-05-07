package com.beet.beetmarket.global.util.uploader.dto.request;

import java.util.List;

public record PreSignedRequestDto(
	List<FileRequestDto> files
) { }
