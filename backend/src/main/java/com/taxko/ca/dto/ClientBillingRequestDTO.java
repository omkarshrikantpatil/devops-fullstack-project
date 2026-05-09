package com.taxko.ca.dto;

import java.math.BigDecimal;

public record ClientBillingRequestDTO(
        Long clientId,
        BigDecimal totalAmount,
        BigDecimal discountAmount
) {}

