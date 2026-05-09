package com.taxko.ca.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CaRegisterRequestDTO {

	private String name;
	private String email;
	private String password;
	private String confirmPassword;

	private LocalDate dobOrDoi;
	private String membershipNumber;
	private String profession;
	private String pan;
	private String telephone;
	private String mobile;
	private String officeAddress;
	private String pinCode;
	private String state;
	private String whatsappLink;
}
