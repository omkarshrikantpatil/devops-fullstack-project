package com.taxko.ca.service;

import com.taxko.ca.dto.ClientSummaryResponseDTO;
import com.taxko.ca.repository.ClientFinancialYearRepository;
import org.springframework.stereotype.Service;

@Service
public class ClientSummaryService {

    private final ClientFinancialYearRepository repository;

    public ClientSummaryService(ClientFinancialYearRepository repository) {
        this.repository = repository;
    }

public ClientSummaryResponseDTO getClientSummary(Long userId, String financialYear) {

    Object result = repository.getClientSummary(userId, financialYear);

    Object[] row = (Object[]) result;

    Long totalClients    = ((Number) row[0]).longValue();
    Long filedClients    = ((Number) row[1]).longValue();
    Long notFiledClients = ((Number) row[2]).longValue();

    return new ClientSummaryResponseDTO(
            userId,
            financialYear,
            totalClients,
            filedClients,
            notFiledClients
    );
}

}

