package com.shaf.ebraire.repository;

import com.shaf.ebraire.domain.Book;
import com.shaf.ebraire.domain.BookedBook;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the BookedBook entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BookedBookRepository extends JpaRepository<BookedBook, Long> {
	@Modifying
    @Query("DELETE from BookedBook WHERE customer.id =:id")
    void deleteFromCustomer(@Param("id") Long id);
	@Query("select book from BookedBook book WHERE customer.id =:id")
	List<BookedBook> getFromCustomer(@Param("id") Long id);
	@Query("select book from BookedBook book Where  expired >= :time")
	List<BookedBook>  getExpiredBookedBook(@Param("time") Long time);
	
}
