package com.taxko.ca.controller;

import com.taxko.ca.dto.ClientBillingRequestDTO;
import com.taxko.ca.entity.ClientBilling;
import com.taxko.ca.service.ClientBillingService;
import com.taxko.ca.util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ca/billing")
public class ClientBillingController {

    private final ClientBillingService billingService;

    public ClientBillingController(ClientBillingService billingService) {
        this.billingService = billingService;
    }

    // CREATE / UPDATE BILLING
    @PostMapping
    public ResponseEntity<String> saveBilling(
            @RequestBody ClientBillingRequestDTO dto) {

        Long userId = SecurityUtil.getCurrentCaId();
        billingService.createOrUpdateBilling(dto, userId);

        return ResponseEntity.ok("Client billing saved successfully");
    }


    // GET BILLING BY CLIENT
    @GetMapping("/client/{clientId}")
    public ResponseEntity<ClientBilling> getBillingByClient(
            @PathVariable Long clientId) {

        return ResponseEntity.ok(
                billingService.getBillingByClient(clientId)
        );
    }
}
