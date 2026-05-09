package com.taxko.ca.controller;

import com.taxko.ca.dto.ClientPaymentRequestDTO;
import com.taxko.ca.entity.ClientPayment;
import com.taxko.ca.service.ClientPaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ca/payments")
public class ClientPaymentController {

    private final ClientPaymentService paymentService;

    public ClientPaymentController(ClientPaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // ADD PAYMENT
    @PostMapping("/{billingId}")
    public ResponseEntity<String> addPayment(
            @PathVariable Long billingId,
            @RequestBody ClientPaymentRequestDTO dto) {

        paymentService.addPayment(billingId, dto);
        return ResponseEntity.ok("Payment added successfully");
    }

    // LIST PAYMENTS
    @GetMapping("/{billingId}")
    public ResponseEntity<List<ClientPayment>> getPayments(
            @PathVariable Long billingId) {

        return ResponseEntity.ok(
                paymentService.getPaymentsByBilling(billingId)
        );
    }
}

