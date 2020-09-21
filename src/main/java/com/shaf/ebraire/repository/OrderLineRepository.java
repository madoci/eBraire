package com.shaf.ebraire.repository;

import com.shaf.ebraire.domain.OrderLine;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the OrderLine entity.
 */
@Repository
public interface OrderLineRepository extends JpaRepository<OrderLine, Long> {
}
