package com.shaf.ebraire.repository.search;

import com.shaf.ebraire.domain.Type;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link Type} entity.
 */
public interface TypeSearchRepository extends ElasticsearchRepository<Type, Long> {
}
