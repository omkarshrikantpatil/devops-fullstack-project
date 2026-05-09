package com.taxko.ca.repository;

import com.taxko.ca.dto.ClientInfoDTO;
import com.taxko.ca.dto.ClientResponseDTO;
import com.taxko.ca.entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

	Page<Client> findByUserId(Long userId, Pageable pageable);

	long countByUserId(Long userId);

	long countByUserIdAndStatusTrue(Long userId);

	@Query("""
    SELECT new com.taxko.ca.dto.ClientResponseDTO(
        c.id,
        c.name,
        c.pan,
        c.mobile,
        c.email,
        c.clientType,
        c.status,
        COALESCE(cb.totalAmount, 0),
        COALESCE(SUM(cp.amountReceived), 0),
        COALESCE(cb.totalAmount, 0) - COALESCE(SUM(cp.amountReceived), 0)
    )
    FROM Client c
    LEFT JOIN ClientBilling cb ON cb.clientId = c.id
    LEFT JOIN ClientPayment cp ON cp.billingId = cb.id
    WHERE c.userId = :userId
    GROUP BY
        c.id, c.name, c.pan, c.mobile, c.email,
        c.clientType, c.status, cb.totalAmount
""")
	Page<ClientResponseDTO> findDashboardClients(Long userId, Pageable pageable);

	@Query("""
SELECT new com.taxko.ca.dto.ClientInfoDTO(
    c.id,
    c.name,
    c.dateOfBirth,
    c.pan,
    c.gstNumber,
    c.mobile,
    c.telephone,
    c.email,
    c.clientType,
    c.status,
    c.address,
    c.state,
    c.pinCode
)
FROM Client c
WHERE c.id = :clientId
AND c.userId = :userId
""")
	Optional<ClientInfoDTO> findClientInfoById(Long clientId, Long userId);

}