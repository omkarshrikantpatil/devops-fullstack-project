package com.taxko.ca.repository;

import com.taxko.ca.entity.ClientPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ClientPaymentRepository extends JpaRepository<ClientPayment, Long> {

    @Query("""
		SELECT COALESCE(SUM(p.amountReceived), 0)
		FROM ClientPayment p
		JOIN ClientBilling b ON p.billingId = b.id
		WHERE b.userId = :userId
	""")
    BigDecimal getTotalReceivedByUser(@Param("userId") Long userId);

    List<ClientPayment> findByBillingId(Long billingId);
}
