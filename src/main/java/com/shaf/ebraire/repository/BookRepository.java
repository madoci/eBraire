package com.shaf.ebraire.repository;

import com.shaf.ebraire.domain.Book;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Book entity.
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    @Query(value = "select distinct book from Book book left join fetch book.tags left join fetch book.genres",
        countQuery = "select count(distinct book) from Book book")
    Page<Book> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct book from Book book left join fetch book.tags left join fetch book.genres")
    List<Book> findAllWithEagerRelationships();

    @Query("select book from Book book left join fetch book.tags left join fetch book.genres where book.id =:id")
    Optional<Book> findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select book from Book book left join fetch book.tags left join fetch book.genres where book.title  like CONCAT('%',CONCAT( :title,'%' ))")
    List<Book> findBooksByTitle(@Param("title") String title);
}
