//package com.taxko.ca.controller;
//
//import com.taxko.ca.entity.ClientDocument;
//import com.taxko.ca.service.ClientDocumentService;
//import org.springframework.data.domain.Page;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/ca/clients/{clientId}/documents")
//public class ClientDocumentController {
//
//	private final ClientDocumentService service;
//
//	public ClientDocumentController(ClientDocumentService service) {
//		this.service = service;
//	}
//
//	// Upload Document
//	@PostMapping
//	public ResponseEntity<?> uploadDocument(@PathVariable Long clientId,
//	                                        @RequestParam Long fyId,
//	                                        @RequestParam Long userId,
//	                                        @RequestParam("file") MultipartFile file,
//	                                        @RequestParam String documentType) throws IOException {
//		ClientDocument doc = service.uploadDocument(clientId, fyId, userId, file, documentType);
//		return ResponseEntity.ok(doc);
//	}
//
//	// Get Client Documents
//	@GetMapping
//	public ResponseEntity<?> getClientDocuments(@PathVariable Long clientId,
//	                                            @RequestParam String financialYear,
//	                                            @RequestParam(defaultValue = "0") int page,
//	                                            @RequestParam(defaultValue = "10") int size) {
//		Page<ClientDocument> docs = service.getClientDocuments(clientId, financialYear, page, size);
//		return ResponseEntity.ok(docs);
//	}
//
//	// Get Document by ID
//	@GetMapping("/{documentId}")
//	public ResponseEntity<?> getDocumentById(@PathVariable Long documentId) {
//		return ResponseEntity.ok(service.getDocumentById(documentId));
//	}
//
//	// Update Document Metadata
//	@PutMapping("/{documentId}")
//	public ResponseEntity<?> updateDocument(@PathVariable Long documentId,
//	                                        @RequestParam(required = false) String documentType,
//	                                        @RequestParam(required = false) Long fyId) {
//		return ResponseEntity.ok(service.updateDocumentMetadata(documentId, documentType, fyId));
//	}
//
//	// Delete Document
//	@DeleteMapping("/{documentId}")
//	public ResponseEntity<?> deleteDocument(@PathVariable Long documentId) throws IOException {
//		service.deleteDocument(documentId);
//		return ResponseEntity.noContent().build();
//	}
//
//	// Get Shareable Link
//	@PostMapping("/{documentId}/share")
//	public ResponseEntity<?> shareDocument(@PathVariable Long documentId,
//	                                       @RequestParam(defaultValue = "reader") String permission) throws IOException {
//		String link = service.getShareableLink(documentId, permission);
//		return ResponseEntity.ok(Map.of("shareableLink", link));
//	}
//}
//
