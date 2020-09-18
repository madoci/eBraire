package com.shaf.ebraire.repository.search;

import com.shaf.ebraire.domain.BookedBook;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link BookedBook} entity.
 */
public interface BookedBookSearchRepository extends ElasticsearchRepository<BookedBook, Long> {
}
