package com.taxko.ca.dto;

import com.taxko.ca.enums.DocumentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClientDocumentResponseDTO {

	private Long id;
	private String fileName;
	private String mimeType;
	private String documentType;
	private String fileUrl;
	private DocumentStatus status;
	private Boolean isActive;
	private String financialYear;
	private LocalDateTime uploadedAt;
	private Long fileSize;
}
