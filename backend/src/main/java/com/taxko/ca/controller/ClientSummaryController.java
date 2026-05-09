package com.taxko.ca.controller;

import com.taxko.ca.dto.ClientSummaryResponseDTO;
import com.taxko.ca.service.ClientSummaryService;
import com.taxko.ca.util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clients")
public class ClientSummaryController {

    private final ClientSummaryService clientSummaryService;

    public ClientSummaryController(ClientSummaryService clientSummaryService) {
        this.clientSummaryService = clientSummaryService;
    }

    // GET CLIENT SUMMARY
    @GetMapping("/summary")
    public ResponseEntity<ClientSummaryResponseDTO> getClientSummary(
            @RequestParam String financialYear) {

        Long userId = SecurityUtil.getCurrentCaId();

        ClientSummaryResponseDTO response =
                clientSummaryService.getClientSummary(userId, financialYear);

        return ResponseEntity.ok(response);
    }
}

