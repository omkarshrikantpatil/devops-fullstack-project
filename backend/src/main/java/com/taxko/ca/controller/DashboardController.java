package com.taxko.ca.controller;

import com.taxko.ca.dto.BillingDashboardResponse;
import com.taxko.ca.service.ClientBillingService;
import com.taxko.ca.util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ca/dashboard")
public class DashboardController {

    private final ClientBillingService billingService;

    public DashboardController(ClientBillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/billing-summary")
    public ResponseEntity<BillingDashboardResponse> getBillingSummary() {

        Long userId = SecurityUtil.getCurrentCaId();

        return ResponseEntity.ok(
                billingService.getDashboardAmounts(userId)
        );
    }
}

