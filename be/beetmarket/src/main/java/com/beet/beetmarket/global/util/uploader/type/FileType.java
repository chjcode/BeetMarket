package com.beet.beetmarket.global.util.uploader.type;

import lombok.Getter;

@Getter
public enum FileType {
	// Image Types
	JPG("jpg", "image/jpeg", UploadType.IMAGE),
	JPEG("jpeg", "image/jpeg", UploadType.IMAGE),
	PNG("png", "image/png", UploadType.IMAGE),
	WEBP("webp", "image/webp", UploadType.IMAGE),

	// Video Types
	MP4("mp4", "video/mp4", UploadType.VIDEO),
	MOV("mov", "video/quicktime", UploadType.VIDEO),
	AVI("avi", "video/x-msvideo", UploadType.VIDEO),
	WMV("wmv", "video/x-ms-wmv", UploadType.VIDEO);

	private final String extension;
	private final String mimeType;
	private final UploadType uploadType;

	FileType(String extension, String mimeType, UploadType uploadType) {
		this.extension = extension;
		this.mimeType = mimeType;
		this.uploadType = uploadType;
	}

	public static FileType getByMimeType(String mime) {
		if (mime == null) return null;
		for (FileType ft : values()) {
			if (ft.mimeType.equalsIgnoreCase(mime)) {
				return ft;
			}
		}
		return null;
	}
}
