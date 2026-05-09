package com.taxko.ca.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter

public class FinancialYearResponseDTO {

	private Long id;
	private String financialYear;
	private boolean current;

}
