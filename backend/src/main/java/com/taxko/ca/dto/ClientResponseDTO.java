package com.taxko.ca.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class ClientResponseDTO {

	private Long id;
	private String name;
	private String pan;
	private String mobile;
	private String email;
	private String clientType;
	private Boolean status;

	// billing
	private BigDecimal billingTotal;
	private BigDecimal billingReceived;
	private BigDecimal billingPending;


}

