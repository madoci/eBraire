package com.shaf.ebraire.repository;

import com.shaf.ebraire.domain.Ordered;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Ordered entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderedRepository extends JpaRepository<Ordered, Long> {
}
