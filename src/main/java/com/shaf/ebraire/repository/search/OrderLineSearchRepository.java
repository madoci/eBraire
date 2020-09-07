package com.shaf.ebraire.repository.search;

import com.shaf.ebraire.domain.OrderLine;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link OrderLine} entity.
 */
public interface OrderLineSearchRepository extends ElasticsearchRepository<OrderLine, Long> {
}
