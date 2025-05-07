package com.beet.beetmarket.global.util.uploader.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.global.response.ResponseWrapper;
import com.beet.beetmarket.global.response.ResponseWrapperFactory;
import com.beet.beetmarket.global.util.uploader.dto.request.PreSignedRequestDto;
import com.beet.beetmarket.global.util.uploader.dto.response.PreSignedResponseDto;
import com.beet.beetmarket.global.util.uploader.service.UploadService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UploadController {

	private final UploadService uploadService;

	@PostMapping("/uploads/pre-signed-url")
	public ResponseEntity<ResponseWrapper<PreSignedResponseDto>> getPreSignedUrl(
		@RequestBody PreSignedRequestDto requestDto,
		@AuthenticationPrincipal User user
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			uploadService.generateUrls(requestDto, user)
		);
	}
}
