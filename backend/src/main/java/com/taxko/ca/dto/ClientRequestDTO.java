package com.taxko.ca.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ClientRequestDTO {

	private String name;
	private LocalDate dateOfBirth;
	private String pan;
//	private Long userId;
	private String gstNumber;
	private String clientType;
	private String telephone;
	private String mobile;
	private String email;
	private String address;
	private String pinCode;
	private String state;
	private Boolean status;
}
