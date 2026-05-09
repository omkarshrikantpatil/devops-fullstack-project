package com.taxko.ca.entity;

import com.taxko.ca.enums.DocumentStatus;
import jakarta.persistence.*;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "client_documents")
@Getter
@Setter
public class ClientDocument {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "client_id", nullable = false)
	private Client client;

	private String fileName;
	private String mimeType;
	private String driveFileId;
	private String driveFileUrl;
	private String documentType;
	private Long fileSize;

	@ManyToOne
	@JoinColumn(name = "financial_year_id")
	private ClientFinancialYear financialYear;

	private Boolean isActive = true;

	@ManyToOne
	@JoinColumn(name = "uploaded_by")
	private User uploadedBy;

	private LocalDateTime uploadedAt = LocalDateTime.now();
	private LocalDateTime updatedAt = LocalDateTime.now();

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private DocumentStatus status;

}