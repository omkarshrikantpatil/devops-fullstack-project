package com.taxko.ca.controller;

import com.taxko.ca.service.ClientFilingToggleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
public class ClientFilingToggleController {

    private final ClientFilingToggleService service;

    public ClientFilingToggleController(ClientFilingToggleService service) {
        this.service = service;
    }

    @PostMapping("/{clientId}/toggle-filing")
    public ResponseEntity<String> toggleFiling(
            @PathVariable Long clientId,
            @RequestParam String financialYear) {

        service.toggleFiling(clientId, financialYear);
        return ResponseEntity.ok("Filing status updated");
    }
}

