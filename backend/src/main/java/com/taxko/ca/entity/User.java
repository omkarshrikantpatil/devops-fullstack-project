package com.taxko.ca.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.jspecify.annotations.Nullable;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    private String role; // MASTER_ADMIN, CA, CLIENT

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "ca_id")
    private Long caId;

    @Column(name = "client_id")
    private Long clientId;


    @Column(name = "date_of_birth")
    private LocalDate dobOrDoi; // Date of Birth / Date of Incorporation

    @Column(name = "membership_number", length = 50)
    private String membershipNumber;

    @Column(length = 50)
    private String profession;

    @Column(length = 10, unique = true)
    private String pan;

    @Column(length = 15)
    private String telephone;

    @Column(length = 15)
    private String mobile;

    @Column(name = "office_address", length = 500)
    private String officeAddress;

    @Column(name = "pin_code", length = 6)
    private String pinCode;

    @Column(length = 50)
    private String state;

    @Column(name = "whatsapp_link", length = 255)
    private String whatsappLink;

}
