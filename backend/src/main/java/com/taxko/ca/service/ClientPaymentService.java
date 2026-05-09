package com.taxko.ca.service;

import com.taxko.ca.dto.ClientPaymentRequestDTO;
import com.taxko.ca.entity.ClientPayment;
import com.taxko.ca.repository.ClientBillingRepository;
import com.taxko.ca.repository.ClientPaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientPaymentService {

    private final ClientPaymentRepository paymentRepo;
    private final ClientBillingRepository billingRepo;

    public ClientPaymentService(
            ClientPaymentRepository paymentRepo,
            ClientBillingRepository billingRepo) {
        this.paymentRepo = paymentRepo;
        this.billingRepo = billingRepo;
    }

    public void addPayment(Long billingId, ClientPaymentRequestDTO dto) {

        billingRepo.findById(billingId)
                .orElseThrow(() -> new RuntimeException("Billing not found"));

        ClientPayment payment = new ClientPayment();
        payment.setBillingId(billingId);
        payment.setAmountReceived(dto.amountReceived());
        payment.setPaymentDate(dto.paymentDate());
        payment.setPaymentMode(dto.paymentMode());
        payment.setReferenceNo(dto.referenceNo());

        paymentRepo.save(payment);
    }

    public List<ClientPayment> getPaymentsByBilling(Long billingId) {
        return paymentRepo.findByBillingId(billingId);
    }
}
