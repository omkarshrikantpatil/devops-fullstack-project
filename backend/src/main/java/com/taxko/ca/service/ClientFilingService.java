package com.taxko.ca.service;

import com.taxko.ca.projection.ClientFilingProjection;
import com.taxko.ca.repository.ClientFinancialYearRepository;
import com.taxko.ca.util.SecurityUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientFilingService {

    private final ClientFinancialYearRepository repository;

    public ClientFilingService(ClientFinancialYearRepository repository) {
        this.repository = repository;
    }

    public List<ClientFilingProjection> getFiledClients(String financialYear) {
        Long userId = SecurityUtil.getCurrentCaId();
        return repository.getFiledClients(userId, financialYear);
    }

    public List<ClientFilingProjection> getNotFiledClients(String financialYear) {
        Long userId = SecurityUtil.getCurrentCaId();
        return repository.getNotFiledClients(userId, financialYear);
    }
}

