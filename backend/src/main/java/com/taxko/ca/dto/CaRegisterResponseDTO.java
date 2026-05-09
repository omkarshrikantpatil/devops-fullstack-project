package com.taxko.ca.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CaRegisterResponseDTO {
	private String message;
	private Long userId;
}
