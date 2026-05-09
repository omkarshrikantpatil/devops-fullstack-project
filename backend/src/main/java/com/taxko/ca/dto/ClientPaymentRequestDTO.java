package com.taxko.ca.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ClientPaymentRequestDTO(
        BigDecimal amountReceived,
        LocalDate paymentDate,
        String paymentMode,
        String referenceNo
) {}

