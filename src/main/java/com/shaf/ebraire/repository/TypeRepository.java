package com.shaf.ebraire.repository;

import com.shaf.ebraire.domain.Type;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Type entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeRepository extends JpaRepository<Type, Long> {
}
