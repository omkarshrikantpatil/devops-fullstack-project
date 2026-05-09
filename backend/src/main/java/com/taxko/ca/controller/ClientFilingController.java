package com.taxko.ca.controller;

import com.taxko.ca.projection.ClientFilingProjection;
import com.taxko.ca.service.ClientFilingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientFilingController {

    private final ClientFilingService service;


    public ClientFilingController(ClientFilingService service) {
        this.service = service;
    }

    // FILED CLIENTS
    @GetMapping("/filed")
    public ResponseEntity<List<ClientFilingProjection>> getFiledClients(
            @RequestParam String financialYear) {

        return ResponseEntity.ok(service.getFiledClients(financialYear));
    }

    // NOT FILED CLIENTS
    @GetMapping("/not-filed")
    public ResponseEntity<List<ClientFilingProjection>> getNotFiledClients(
            @RequestParam String financialYear) {

        return ResponseEntity.ok(service.getNotFiledClients(financialYear));
    }
}

