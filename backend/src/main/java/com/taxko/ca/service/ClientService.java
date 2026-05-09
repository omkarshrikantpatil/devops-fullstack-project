package com.taxko.ca.service;

import com.taxko.ca.dto.ClientDocumentResponseDTO;
import com.taxko.ca.dto.ClientInfoDTO;
import com.taxko.ca.dto.ClientRequestDTO;
import com.taxko.ca.dto.ClientResponseDTO;
import com.taxko.ca.entity.Client;
import com.taxko.ca.entity.ClientDocument;
import com.taxko.ca.entity.ClientFinancialYear;
import com.taxko.ca.entity.User;
import com.taxko.ca.enums.DocumentStatus;
import com.taxko.ca.repository.ClientDocumentRepository;
import com.taxko.ca.repository.ClientFinancialYearRepository;
import com.taxko.ca.repository.ClientRepository;
import com.taxko.ca.repository.UserRepository;
import com.taxko.ca.util.SecurityUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ClientService {

	private final ClientRepository clientRepository;
	private final UserRepository userRepository;
	private final ClientFinancialYearRepository financialYearRepository;
	private final ClientDocumentRepository clientDocumentRepository;
	private final S3FileService s3FileService;

	public ClientService(ClientRepository clientRepository, UserRepository userRepository,
	                     ClientFinancialYearRepository financialYearRepository,ClientDocumentRepository clientDocumentRepository,
	                     S3FileService s3FileService) {
		this.clientRepository = clientRepository;
		this.userRepository=userRepository;
		this.financialYearRepository=financialYearRepository;
		this.clientDocumentRepository = clientDocumentRepository;
		this.s3FileService = s3FileService;
	}

	public long getClientCountForCurrentUser(Long userId) {
		return clientRepository.countByUserId(userId);
	}

	//create client
	public void createClient(ClientRequestDTO dto, Long userId) {

		Client client = new Client();
		mapDtoToEntity(dto, client);
		client.setUserId(userId);

		clientRepository.save(client);
	}

	//Update client
	public void updateClient(Long id, ClientRequestDTO dto) {

		Client client = clientRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Client not found"));

		mapDtoToEntity(dto, client);
		clientRepository.save(client);
	}

	//get all client
	public Page<ClientResponseDTO> getClients(int page, int size) {

		Long userId = SecurityUtil.getCurrentCaId();

		Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

		return clientRepository.findDashboardClients(userId, pageable);

	}

	public ClientInfoDTO getClientInfo(Long clientId, Long userId) {

		return clientRepository.findClientInfoById(clientId, userId)
				.orElseThrow(() -> new RuntimeException("Client not found"));
	}

	private void mapDtoToEntity(ClientRequestDTO dto, Client client) {

		client.setName(dto.getName());
		client.setDateOfBirth(dto.getDateOfBirth());
		client.setPan(dto.getPan());
		client.setGstNumber(dto.getGstNumber());
		client.setClientType(dto.getClientType());
		client.setTelephone(dto.getTelephone());
		client.setMobile(dto.getMobile());
		client.setEmail(dto.getEmail());
		client.setAddress(dto.getAddress());
		client.setPinCode(dto.getPinCode());
		client.setState(dto.getState());
		client.setStatus(dto.getStatus());
	}

	public long getActiveClientCountForLoggedInUser() {

		Long userId = (Long) SecurityContextHolder
				.getContext()
				.getAuthentication()
				.getPrincipal();

		return clientRepository.countByUserIdAndStatusTrue(userId);
	}

	public List<ClientDocument> uploadClientDocuments(
			Long clientId,
			Long financialYearId,
			String documentType,
			MultipartFile[] files,
			Long userId
	) throws IOException {

		Client client = clientRepository.findById(clientId)
				.orElseThrow(() -> new RuntimeException("Client not found"));

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));

		ClientFinancialYear financialYear =
				financialYearRepository.findById(financialYearId)
						.orElseThrow(() -> new RuntimeException("Financial year not found"));

		List<ClientDocument> savedDocs = new ArrayList<>();

		for (MultipartFile file : files) {

			String key = "ca/" + user.getId()
					+ "/clients/" + client.getId()
					+ "/" + financialYear.getFinancialYear()
					+ "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

			String fileUrl = s3FileService.uploadFile(file, key);

			ClientDocument doc = new ClientDocument();
			doc.setClient(client);
			doc.setFileName(file.getOriginalFilename());
			doc.setMimeType(file.getContentType());
			doc.setDriveFileId(key);
			doc.setDriveFileUrl(fileUrl);
			doc.setDocumentType(documentType);
			doc.setFinancialYear(financialYear);
			doc.setUploadedBy(user);
			doc.setStatus(DocumentStatus.PENDING); // default
			doc.setIsActive(true);
			doc.setFileSize(file.getSize());
			savedDocs.add(clientDocumentRepository.save(doc));
		}

		return savedDocs;
	}

	private ClientDocumentResponseDTO mapToResponseDTO(ClientDocument doc) {

		return new ClientDocumentResponseDTO(
				doc.getId(),
				doc.getFileName(),
				doc.getMimeType(),
				doc.getDocumentType(),
				doc.getDriveFileUrl(),
				doc.getStatus(),
				doc.getIsActive(),
				doc.getFinancialYear().getFinancialYear(),
				doc.getUploadedAt(),
				doc.getFileSize()
		);
	}
	public Page<ClientDocumentResponseDTO> getClientDocuments(
			Long clientId,
			Long financialYearId,
			Long userId,
			int page,
			int size
	) {
		// Security check: client belongs to CA
		Client client = clientRepository.findById(clientId)
				.orElseThrow(() -> new RuntimeException("Client not found"));

		if (!client.getUserId().equals(userId)) {
			throw new RuntimeException("Unauthorized access");
		}

		Pageable pageable = PageRequest.of(
				page,
				size,
				Sort.by("uploadedAt").descending()
		);

		return clientDocumentRepository
				.findByClient_IdAndFinancialYear_Id(
						clientId,
						financialYearId,
						pageable
				)
				.map(this::mapToResponseDTO);
	}

}
