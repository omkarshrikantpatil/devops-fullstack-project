package com.taxko.ca.controller;

import com.taxko.ca.dto.ClientFinancialYearRequestDTO;
import com.taxko.ca.dto.FinancialYearResponseDTO;
import com.taxko.ca.service.ClientFinancialYearService;
import com.taxko.ca.util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client-financial-years")
public class ClientFinancialYearController {

	private final ClientFinancialYearService service;

	public ClientFinancialYearController(ClientFinancialYearService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<String> createFinancialYear(
			@RequestBody ClientFinancialYearRequestDTO dto) {

		// Taken from JWT
		Long userId = SecurityUtil.getCurrentCaId();

		service.createFinancialYear(dto, userId);

		return ResponseEntity.ok("Client financial year created successfully");
	}

	@GetMapping
	public ResponseEntity<List<FinancialYearResponseDTO>> getFinancialYears() {

		Long userId = SecurityUtil.getCurrentCaId();

		return ResponseEntity.ok(service.getFinancialYears(userId));
	}


}

