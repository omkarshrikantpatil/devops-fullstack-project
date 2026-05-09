package com.taxko.ca.repository;

import com.taxko.ca.entity.ClientFinancialYear;
import com.taxko.ca.projection.ClientFilingProjection;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface ClientFinancialYearRepository
        extends JpaRepository<ClientFinancialYear, Long> {

	boolean existsByClientIdAndUserIdAndFinancialYear(
			Long clientId,
			Long userId,
			String financialYear
	);



    @Query(value = """
    SELECT
        COUNT(DISTINCT client_id) AS total_clients,
        COUNT(DISTINCT client_id) FILTER (WHERE is_filed = TRUE) AS filed_clients,
        COUNT(DISTINCT client_id) FILTER (WHERE is_filed = FALSE OR is_filed IS NULL) AS not_filed_clients
    FROM client_financial_years
    WHERE user_id = :userId
      AND financial_year = :financialYear
    """, nativeQuery = true)
    Object getClientSummary(@Param("userId") Long userId,
                            @Param("financialYear") String financialYear);

	// FILED CLIENTS
	@Query(value = """
    SELECT
        c.id           AS id,
        c.full_name    AS fullName,
        c.email        AS email,
        c.mobile       AS mobile,
        c.pan          AS pan,
        c.client_type  AS clientType
    FROM client_financial_years cfy
    JOIN clients c ON c.id = cfy.client_id
    WHERE cfy.user_id = :userId
      AND cfy.financial_year = :financialYear
      AND cfy.is_filed = TRUE
    """, nativeQuery = true)
	List<ClientFilingProjection> getFiledClients(
			@Param("userId") Long userId,
			@Param("financialYear") String financialYear
	);


	// NOT FILED CLIENTS
	@Query(value = """
    SELECT
        c.id           AS id,
        c.full_name    AS fullName,
        c.email        AS email,
        c.mobile       AS mobile,
        c.pan          AS pan,
        c.client_type  AS clientType
    FROM client_financial_years cfy
    JOIN clients c ON c.id = cfy.client_id
    WHERE cfy.user_id = :userId
      AND cfy.financial_year = :financialYear
      AND (cfy.is_filed = FALSE OR cfy.is_filed IS NULL)
    """, nativeQuery = true)
	List<ClientFilingProjection> getNotFiledClients(
			@Param("userId") Long userId,
			@Param("financialYear") String financialYear
	);

	@Modifying
	@Transactional
	@Query(value = """
        INSERT INTO client_financial_years
        (client_id, user_id, financial_year, is_filed, filed_date)
        VALUES (:clientId, :userId, :financialYear, true, CURRENT_DATE)
        ON CONFLICT (client_id, user_id, financial_year)
        DO UPDATE SET
            is_filed = NOT client_financial_years.is_filed,
            filed_date = CASE
                WHEN client_financial_years.is_filed = false
                THEN CURRENT_DATE
                ELSE NULL
            END
        """, nativeQuery = true)
	void toggleFilingStatus(@Param("clientId") Long clientId,
							@Param("userId") Long userId,
							@Param("financialYear") String financialYear);

	@Query(value = """
    SELECT
        id,
        financial_year
    FROM client_financial_years
    WHERE user_id = :userId
    GROUP BY id, financial_year
    ORDER BY financial_year DESC
    """, nativeQuery = true)
	List<Object[]> findFinancialYearsByUser(@Param("userId") Long userId);
}

