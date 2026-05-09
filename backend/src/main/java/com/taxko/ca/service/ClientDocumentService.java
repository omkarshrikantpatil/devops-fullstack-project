//package com.taxko.ca.service;
//
//import com.google.api.services.drive.model.File;
//import com.taxko.ca.entity.Client;
//import com.taxko.ca.entity.ClientDocument;
//import com.taxko.ca.entity.ClientFinancialYear;
//import com.taxko.ca.entity.User;
//import com.taxko.ca.repository.ClientDocumentRepository;
//import com.taxko.ca.repository.ClientFinancialYearRepository;
//import com.taxko.ca.repository.ClientRepository;
//import com.taxko.ca.repository.UserRepository;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.domain.Sort;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.time.LocalDateTime;
//
//@Service
//public class ClientDocumentService {
//
//	private final ClientDocumentRepository repository;
//	private final ClientRepository clientRepository;
//	private final ClientFinancialYearRepository fyRepository;
//	private final UserRepository userRepository;
//	private final GoogleDriveService driveService;
//
//	public ClientDocumentService(ClientDocumentRepository repository,
//	                             ClientRepository clientRepository,
//	                             ClientFinancialYearRepository fyRepository,
//	                             UserRepository userRepository,
//	                             GoogleDriveService driveService) {
//		this.repository = repository;
//		this.clientRepository = clientRepository;
//		this.fyRepository = fyRepository;
//		this.userRepository = userRepository;
//		this.driveService = driveService;
//	}
//
//	public ClientDocument uploadDocument(Long clientId, Long fyId, Long userId,
//	                                     MultipartFile file, String documentType) throws IOException {
//		Client client = clientRepository.findById(clientId)
//				.orElseThrow(() -> new RuntimeException("Client not found"));
//		ClientFinancialYear fy = fyRepository.findById(fyId)
//				.orElse(null);
//		User user = userRepository.findById(userId)
//				.orElseThrow(() -> new RuntimeException("User not found"));
//
//		File uploaded = driveService.uploadFile(file);
//
//		ClientDocument doc = new ClientDocument();
//		doc.setClient(client);
//		doc.setFinancialYear(fy);
//		doc.setUploadedBy(user);
//		doc.setFileName(uploaded.getName());
//		doc.setDriveFileId(uploaded.getId());
//		doc.setDriveFileUrl(uploaded.getWebViewLink());
//		doc.setDocumentType(documentType);
//		doc.setUploadedAt(LocalDateTime.now());
//		doc.setUpdatedAt(LocalDateTime.now());
//
//		return repository.save(doc);
//	}
//
//	public Page<ClientDocument> getClientDocuments(Long clientId, String financialYear, int page, int size) {
//		Pageable pageable = PageRequest.of(page, size, Sort.by("uploadedAt").descending());
//		return repository.findByClientIdAndFinancialYear_FinancialYear(clientId, financialYear, pageable);
//	}
//
//	public ClientDocument getDocumentById(Long id) {
//		return repository.findById(id).orElseThrow(() -> new RuntimeException("Document not found"));
//	}
//
//	public ClientDocument updateDocumentMetadata(Long id, String documentType, Long fyId) {
//		ClientDocument doc = getDocumentById(id);
//		if (documentType != null) doc.setDocumentType(documentType);
//		if (fyId != null) {
//			ClientFinancialYear fy = fyRepository.findById(fyId).orElse(null);
//			doc.setFinancialYear(fy);
//		}
//		doc.setUpdatedAt(LocalDateTime.now());
//		return repository.save(doc);
//	}
//
//	public void deleteDocument(Long id) throws IOException {
//		ClientDocument doc = getDocumentById(id);
//		driveService.deleteFile(doc.getDriveFileId());
//		repository.delete(doc);
//	}
//
//	public String getShareableLink(Long id, String permission) throws IOException {
//		ClientDocument doc = getDocumentById(id);
//		return driveService.generateShareableLink(doc.getDriveFileId(), permission);
//	}
//}
//
