package com.beet.beetmarket.global.util.uploader.dto.response;

import java.util.List;

public record PreSignedResponseDto(
	String uuid,
	List<FileUrlDto> files
) {
	public static PreSignedResponseDto from(String postUuid, List<FileUrlDto> files) {

		return new PreSignedResponseDto(postUuid, files);
	}
}
