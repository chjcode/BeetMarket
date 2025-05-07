package com.beet.beetmarket.global.util.uploader.dto.response;

public record FileUrlDto(
	String presignedUrl,
	String publicUrl
) {
	public static FileUrlDto from(String presignedUrl, String publicUrl) {
		return new FileUrlDto(presignedUrl, publicUrl);
	}
}
