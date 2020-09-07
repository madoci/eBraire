package com.shaf.ebraire.repository.search;

import com.shaf.ebraire.domain.Ordered;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link Ordered} entity.
 */
public interface OrderedSearchRepository extends ElasticsearchRepository<Ordered, Long> {
}
