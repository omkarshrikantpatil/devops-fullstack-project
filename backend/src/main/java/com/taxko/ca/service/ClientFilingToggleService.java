package com.taxko.ca.service;

import com.taxko.ca.repository.ClientFinancialYearRepository;
import com.taxko.ca.util.SecurityUtil;
import org.springframework.stereotype.Service;

@Service
public class ClientFilingToggleService {

    private final ClientFinancialYearRepository repository;

    public ClientFilingToggleService(ClientFinancialYearRepository repository) {
        this.repository = repository;
    }

    public void toggleFiling(Long clientId, String financialYear) {
        Long userId = SecurityUtil.getCurrentCaId();
        repository.toggleFilingStatus(clientId, userId, financialYear);
    }
}

