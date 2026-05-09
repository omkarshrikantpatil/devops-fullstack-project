package com.taxko.ca.controller;

import com.taxko.ca.dto.ClientDocumentResponseDTO;
import com.taxko.ca.dto.ClientInfoDTO;
import com.taxko.ca.dto.ClientRequestDTO;
import com.taxko.ca.dto.ClientResponseDTO;

import com.taxko.ca.util.JwtUtil;
import com.taxko.ca.service.ClientService;
import com.taxko.ca.util.SecurityUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;


@RestController
@RequestMapping("/ca/clients")
public class ClientController {

	private final ClientService clientService;
	private final JwtUtil jwtUtil;


	public ClientController(ClientService clientService, JwtUtil jwtUtil) {
		this.clientService = clientService;
		this.jwtUtil = jwtUtil;

	}


	// CREATE CLIENT
	@PostMapping
	public ResponseEntity<?> createClient(@RequestBody ClientRequestDTO dto) {

		Long userId = SecurityUtil.getCurrentCaId();

		clientService.createClient(dto, userId);

		return ResponseEntity.ok("Client created successfully");
	}

	// UPDATE CLIENT
	@PutMapping("/{id}")
	public ResponseEntity<?> updateClient(
			@PathVariable Long id,
			@RequestBody ClientRequestDTO dto) {

		clientService.updateClient(id, dto);
		return ResponseEntity.ok("Client updated successfully");
	}

	// DASHBOARD - TOTAL CLIENT COUNT
	@GetMapping("/count")
	public ResponseEntity<Long> getClientCount() {

		Long userId = SecurityUtil.getCurrentCaId();
		long count = clientService.getClientCountForCurrentUser(userId);

		return ResponseEntity.ok(count);
	}

	// PAGINATED CLIENT LIST
	@GetMapping
	public ResponseEntity<Page<ClientResponseDTO>> getClients(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size
	) {

		// Optional safety
		page = Math.max(page, 0);
		size = Math.min(size, 50);

		return ResponseEntity.ok(
				clientService.getClients(page, size)
		);
	}

	// Get client by id
	@GetMapping("/{clientId}")
	public ResponseEntity<ClientInfoDTO> getClientById(
			@PathVariable Long clientId) {

		Long userId = SecurityUtil.getCurrentCaId();
		return ResponseEntity.ok(clientService.getClientInfo(clientId, userId));
	}

	@GetMapping("/active/count")
	public ResponseEntity<Map<String, Long>> getActiveClientCount() {

		long count = clientService.getActiveClientCountForLoggedInUser();

		return ResponseEntity.ok(
				Map.of("activeClientCount", count)
		);
	}

	@PostMapping("/{clientId}/documents")
	public ResponseEntity<?> uploadMultipleFiles(
			@PathVariable Long clientId,
			@RequestParam("files") MultipartFile[] files,
			@RequestParam String documentType,
			@RequestParam Long financialYearId
	) throws IOException {

		Long userId = SecurityUtil.getCurrentCaId();

		return ResponseEntity.ok(
				clientService.uploadClientDocuments(
						clientId,
						financialYearId,
						documentType,
						files,
						userId
				)
		);
	}

	// GET CLIENT DOCUMENTS (by FY)
	@GetMapping("/{clientId}/documents")
	public ResponseEntity<Page<ClientDocumentResponseDTO>> getClientDocuments(
			@PathVariable Long clientId,
			@RequestParam Long financialYearId,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size
	) {
		Long userId = SecurityUtil.getCurrentCaId();

		Page<ClientDocumentResponseDTO> docs =
				clientService.getClientDocuments(
						clientId,
						financialYearId,
						userId,
						page,
						size
				);

		return ResponseEntity.ok(docs);
	}
}
