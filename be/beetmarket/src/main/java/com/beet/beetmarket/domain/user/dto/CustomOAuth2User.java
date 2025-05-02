package com.beet.beetmarket.domain.user.dto;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.beet.beetmarket.domain.user.entity.User;


public class CustomOAuth2User implements OAuth2User {
	private final User user;

	public CustomOAuth2User(User user) {
		this.user = user;
	}

	@Override
	public Map<String, Object> getAttributes() {
		return null;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {

		Collection<GrantedAuthority> authorities = new ArrayList<>();
		authorities.add((GrantedAuthority)() -> "ROLE_USER");

		return authorities;
	}

	@Override
	public String getName() {
		return user.getEmail();
	}

	public User getUser() {
		return user;
	}
}
