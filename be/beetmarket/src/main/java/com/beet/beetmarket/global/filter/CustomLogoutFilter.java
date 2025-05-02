package com.beet.beetmarket.global.filter;

import java.io.IOException;

import org.springframework.web.filter.GenericFilterBean;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


public class CustomLogoutFilter extends GenericFilterBean {
//	private final TokenBlackListRepository tokenBlackListRepository;
//
//	public CustomLogoutFilter(TokenBlackListRepository tokenBlackListRepository) {
//		this.tokenBlackListRepository = tokenBlackListRepository;
//	}
//
	@Override
	public void doFilter(
		ServletRequest request,
		ServletResponse response,
		FilterChain chain
	) throws IOException, ServletException {
		doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
	}
//
//	public void doFilter(
//		HttpServletRequest request,
//		HttpServletResponse response,
//		FilterChain chain
//	) throws IOException, ServletException {
//		String requestUri = request.getRequestURI();
//		String requestMethod = request.getMethod();
//		if (!(requestMethod.equals("POST") && requestUri.startsWith("/auth/logout"))) {
//			chain.doFilter(request, response);
//			return;
//		}
//
//		if (request.getHeader("Authorization") == null) {
//			chain.doFilter(request, response);
//			return;
//		}
//
//		String accessToken = request.getHeader("Authorization").substring(7);
//
//		tokenBlackListRepository.save(new TokenBlackList(accessToken));
//
//		ResponseWrapperFactory.setResponse(
//			response,
//			HttpStatus.OK,
//			null
//		);
//	}
}
