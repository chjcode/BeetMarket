package com.beet.beetmarket.domain.user.dto.oauthresponse;

import java.util.Map;

public class NaverResponse implements OAuth2Response {
	private final Map<String, Object> attributes;

	public NaverResponse(Map<String, Object> attributes) {
		this.attributes = (Map<String, Object>) attributes.get("response");

	}
	@Override
	public String getProvider() {
		return "naver";
	}

	@Override
	public String getProviderId() {
		return attributes.get("id").toString();
	}

	@Override
	public String getEmail() {
		return attributes.get("email").toString();
	}

	@Override
	public String getName() {
		return attributes.get("name").toString();
	}

	@Override
	public String getProfileImg() {
		return attributes.get("profile_image").toString();
	}
}
