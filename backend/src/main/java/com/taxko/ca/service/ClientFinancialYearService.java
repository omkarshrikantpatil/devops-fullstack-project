package com.taxko.ca.service;

import com.taxko.ca.dto.ClientFinancialYearRequestDTO;
import com.taxko.ca.dto.FinancialYearResponseDTO;
import com.taxko.ca.entity.ClientFinancialYear;
import com.taxko.ca.repository.ClientFinancialYearRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ClientFinancialYearService {

	private final ClientFinancialYearRepository repository;

	public ClientFinancialYearService(ClientFinancialYearRepository repository) {
		this.repository = repository;
	}

	public void createFinancialYear(ClientFinancialYearRequestDTO dto, Long userId) {

		// Duplicate check
		boolean exists = repository.existsByClientIdAndUserIdAndFinancialYear(
				dto.getClientId(),
				userId,
				dto.getFinancialYear()
		);

		if (exists) {
			throw new RuntimeException("Financial year already exists for this client");
		}

		ClientFinancialYear fy = new ClientFinancialYear();
		fy.setClientId(dto.getClientId());
		fy.setUserId(userId);
		fy.setFinancialYear(dto.getFinancialYear());
		fy.setIsFiled(false);   // default false
		fy.setFiledDate(null);

		repository.save(fy);
	}

	public List<FinancialYearResponseDTO> getFinancialYears(Long userId) {

		List<Object[]> rows = repository.findFinancialYearsByUser(userId);

		String currentFY = getCurrentFinancialYear();

		return rows.stream()
				.map(r -> new FinancialYearResponseDTO(
						((Number) r[0]).longValue(),
						(String) r[1],
						r[1].equals(currentFY)
				))
				.toList();
	}

	private String getCurrentFinancialYear() {
		int year = LocalDate.now().getYear();
		int month = LocalDate.now().getMonthValue();

		if (month >= 4) {
			return year + "-" + String.valueOf(year + 1).substring(2);
		} else {
			return (year - 1) + "-" + String.valueOf(year).substring(2);
		}
	}


}

