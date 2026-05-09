package com.taxko.ca.repository;

import com.taxko.ca.entity.ClientBilling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface ClientBillingRepository extends JpaRepository<ClientBilling, Long> {

    Optional<ClientBilling> findByClientId(Long clientId);

    @Query("""
		SELECT COALESCE(SUM(b.netAmount), 0)
		FROM ClientBilling b
		WHERE b.userId = :userId
	""")
    BigDecimal getTotalBillingByUser(@Param("userId") Long userId);
}


