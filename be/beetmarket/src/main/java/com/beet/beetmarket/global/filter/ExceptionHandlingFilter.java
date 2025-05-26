package com.beet.beetmarket.global.filter;

import java.io.IOException;

import org.springframework.web.filter.OncePerRequestFilter;

import com.beet.beetmarket.global.exception.BaseRuntimeException;
import com.beet.beetmarket.global.exception.CustomException;
import com.beet.beetmarket.global.exception.ExceptionCode;
import com.beet.beetmarket.global.response.ResponseWrapperFactory;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


public class ExceptionHandlingFilter extends OncePerRequestFilter {
	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {
		try {
			doFilter(request, response, filterChain);
		} catch (BaseRuntimeException e) {
			CustomException customException = e.getClass().getAnnotation(CustomException.class);

			ExceptionCode exceptionCode = customException.value();

			ResponseWrapperFactory.setResponse(
				response,
				exceptionCode,
				null
			);
		}
	}
}
