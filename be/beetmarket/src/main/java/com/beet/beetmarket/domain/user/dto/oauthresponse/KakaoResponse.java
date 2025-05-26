package com.beet.beetmarket.domain.user.dto.oauthresponse;

import java.util.Map;

public class KakaoResponse implements OAuth2Response {
	private final Map<String, Object> attributes;

	public KakaoResponse(Map<String, Object> attributes) {
		this.attributes = attributes;
	}

	private Map<String, Object> kakaoAccount() {
		return (Map<String, Object>)attributes.get("kakao_account");
	}

	private Map<String, Object> profile() {
		return (Map<String, Object>)kakaoAccount().get("profile");
	}

	@Override
	public String getProvider() {
		return "kakao";
	}

	@Override
	public String getProviderId() {
		return attributes.get("id").toString();
	}

	@Override
	public String getEmail() {
		return kakaoAccount().get("email").toString();
	}

	@Override
	public String getName() {
		return profile().get("nickname").toString();
	}

	@Override
	public String getProfileImg() {
		return profile().get("profile_image_url").toString();
	}
}
