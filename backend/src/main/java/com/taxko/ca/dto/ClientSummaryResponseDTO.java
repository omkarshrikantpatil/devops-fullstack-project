package com.taxko.ca.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ClientSummaryResponseDTO {

    private Long userId;
    private String financialYear;
    private Long totalClients;
    private Long filedClients;
    private Long notFiledClients;
}

