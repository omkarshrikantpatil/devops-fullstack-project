package com.taxko.ca.util;

import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

	public static Long getCurrentCaId() {
		Object principal = SecurityContextHolder
				.getContext()
				.getAuthentication()
				.getPrincipal();

		return (Long) principal;
	}
}
