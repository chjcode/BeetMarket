package com.beet.beetmarket.global.util.uploader.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.beet.beetmarket.config.MinioConfig;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.global.util.uploader.dto.request.FileRequestDto;
import com.beet.beetmarket.global.util.uploader.dto.request.PreSignedRequestDto;
import com.beet.beetmarket.global.util.uploader.dto.response.FileUrlDto;
import com.beet.beetmarket.global.util.uploader.dto.response.PreSignedResponseDto;
import com.beet.beetmarket.global.util.uploader.exception.InvalidFileTypeException;
import com.beet.beetmarket.global.util.uploader.exception.PresignedUrlGenerationFailException;
import com.beet.beetmarket.global.util.uploader.type.FileType;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UploadService {

	private final MinioClient minioClient;
	private final MinioConfig minioConfig;

	public PreSignedResponseDto generateUrls(PreSignedRequestDto requestDto, User user) {

		String postUuid = (requestDto.uuid() != null && !requestDto.uuid().isBlank())
			? requestDto.uuid()
			: UUID.randomUUID().toString();

		List<FileUrlDto> fileResponses = new ArrayList<>();
		for (FileRequestDto file : requestDto.files()) {
			FileType fileType = validateType(file.fileName(), file.fileType());
			String objectName = generateObjectPath(user.getId(), postUuid, fileType);
			String preSignedUrl = generatePreSignedUrl(objectName);
			String publicUrl = generatePublicUrl(objectName);
			fileResponses.add(FileUrlDto.from(preSignedUrl, publicUrl));
		}
		return PreSignedResponseDto.from(postUuid, fileResponses);
	}

	private FileType validateType(String fileName, String mimeType) {
		FileType fileType = FileType.getByMimeType(mimeType);
		if (fileType == null) {
			throw new InvalidFileTypeException();
		}

		String ext = extractExtension(fileName);
		// 대소문자 구분하지 않고 비교
		if (!fileType.getExtension().equalsIgnoreCase(ext)) {
			throw new InvalidFileTypeException();
		}

		return fileType;
	}

	private String extractExtension(String fileName) {
		int dotIdx = fileName.lastIndexOf(".");
		if (dotIdx < 0 || dotIdx == fileName.length() - 1) {
			throw new InvalidFileTypeException();
		}
		return fileName.substring(dotIdx + 1).toLowerCase();
	}

	private String generateObjectPath(Long userId, String postUuid, FileType fileType) {
		String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
		String fileUuid = UUID.randomUUID().toString();

		return String.format("%d/%s/%s/%s.%s",
			userId,
			postUuid,
			timestamp,
			fileUuid,
			fileType.getExtension()
		);
	}

	private String generatePreSignedUrl(String objectName) {
		try {
			return minioClient.getPresignedObjectUrl(
				GetPresignedObjectUrlArgs.builder()
					.bucket(minioConfig.getBucketName())
					.object(objectName)
					.method(Method.PUT)
					.expiry(60 * 10)
					.build());
		} catch (Exception e) {
			throw new PresignedUrlGenerationFailException();
		}
	}

	private String generatePublicUrl(String objectName) {
		return String.format("%s/%s/%s", minioConfig.getUrl(), minioConfig.getBucketName(), objectName);
	}
}
