package com.shaf.ebraire.repository.search;

import com.shaf.ebraire.domain.Genre;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link Genre} entity.
 */
public interface GenreSearchRepository extends ElasticsearchRepository<Genre, Long> {
}
