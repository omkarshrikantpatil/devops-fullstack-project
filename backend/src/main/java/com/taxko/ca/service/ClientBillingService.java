package com.taxko.ca.service;

import com.taxko.ca.dto.BillingDashboardResponse;
import com.taxko.ca.dto.ClientBillingRequestDTO;
import com.taxko.ca.entity.ClientBilling;
import com.taxko.ca.repository.ClientBillingRepository;
import com.taxko.ca.repository.ClientPaymentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class ClientBillingService {

    private final ClientBillingRepository billingRepo;
    private final ClientPaymentRepository paymentRepo;

    public ClientBillingService(
            ClientBillingRepository billingRepo,
            ClientPaymentRepository paymentRepo) {
        this.billingRepo = billingRepo;
        this.paymentRepo = paymentRepo;
    }

    public void createOrUpdateBilling(ClientBillingRequestDTO dto, Long userId) {

        ClientBilling billing = billingRepo
                .findByClientId(dto.clientId())
                .orElse(new ClientBilling());

        billing.setClientId(dto.clientId());
        billing.setUserId(userId);
        billing.setTotalAmount(dto.totalAmount());
        billing.setDiscountAmount(dto.discountAmount());

        BigDecimal netAmount = dto.totalAmount()
                .subtract(dto.discountAmount() == null ? BigDecimal.ZERO : dto.discountAmount());

        billing.setNetAmount(netAmount);
        billing.setUpdatedAt(LocalDateTime.now());

        billingRepo.save(billing);
    }

    public ClientBilling getBillingByClient(Long clientId) {
        return billingRepo.findByClientId(clientId)
                .orElseThrow(() -> new RuntimeException("Billing not found"));
    }

    public BillingDashboardResponse getDashboardAmounts(Long userId) {

        BigDecimal totalBilling = billingRepo.getTotalBillingByUser(userId);
        BigDecimal totalReceived = paymentRepo.getTotalReceivedByUser(userId);
        BigDecimal totalPending = totalBilling.subtract(totalReceived);

        return new BillingDashboardResponse(
                totalBilling,
                totalReceived,
                totalPending
        );
    }
}

