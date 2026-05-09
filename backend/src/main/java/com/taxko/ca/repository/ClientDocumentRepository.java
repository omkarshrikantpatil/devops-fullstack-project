package com.taxko.ca.repository;

import com.taxko.ca.entity.ClientDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientDocumentRepository extends JpaRepository<ClientDocument, Long> {

	Page<ClientDocument> findByClient_IdAndFinancialYear_Id(
			Long clientId,
			Long financialYearId,
			Pageable pageable);
}
