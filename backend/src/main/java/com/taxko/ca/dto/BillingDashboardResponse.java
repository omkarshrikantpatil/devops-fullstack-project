package com.taxko.ca.dto;

import java.math.BigDecimal;

public record BillingDashboardResponse(
        BigDecimal totalBilling,
        BigDecimal totalReceived,
        BigDecimal totalPending
) {}

