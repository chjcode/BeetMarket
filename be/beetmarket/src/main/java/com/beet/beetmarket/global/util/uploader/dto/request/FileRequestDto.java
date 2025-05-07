package com.beet.beetmarket.global.util.uploader.dto.request;

public record FileRequestDto(
	String fileName,
	String fileType,
	Long filesize
) { }
