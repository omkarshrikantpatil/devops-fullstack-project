package com.taxko.ca.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientFinancialYearRequestDTO {
	private Long clientId;
	private String financialYear; // e.g. "2024-25"
}
