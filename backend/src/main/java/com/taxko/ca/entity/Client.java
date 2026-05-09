package com.taxko.ca.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "clients")
@Getter
@Setter
public class Client {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name="full_name")
	private String name;

	@Column(name = "date_of_birth")
	private LocalDate dateOfBirth;

	@Column(length = 10)
	private String pan;

	@Column(name = "gst_number", length = 15)
	private String gstNumber;

	@Column(name = "client_type")
	private String clientType; // INDIVIDUAL, BUSINESS

	private String telephone;

	private String mobile;

	private String email;

	@Column(length = 500)
	private String address;

	@Column(name = "pin_code", length = 6)
	private String pinCode;

	private String state;

	private Boolean status; // ACTIVE, INACTIVE

	@Column(name = "user_id")
	private Long userId;
}

