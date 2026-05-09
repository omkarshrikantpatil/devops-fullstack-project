package com.taxko.ca.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class ClientInfoDTO {

	private Long id;
	private String name;
	private LocalDate dateOfBirth;
	private String pan;
	private String gstNumber;
	private String mobile;
	private String telephone;
	private String email;
	private String clientType;
	private Boolean status;
	private String address;
	private String state;
	private String pinCode;
}
