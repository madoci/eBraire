package com.shaf.ebraire.web.rest;

import com.shaf.ebraire.domain.Ordered;
import com.shaf.ebraire.repository.OrderedRepository;
import com.shaf.ebraire.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.shaf.ebraire.domain.Ordered}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrderedResource {

    private final Logger log = LoggerFactory.getLogger(OrderedResource.class);

    private static final String ENTITY_NAME = "ordered";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderedRepository orderedRepository;

    public OrderedResource(OrderedRepository orderedRepository) {
        this.orderedRepository = orderedRepository;
    }

    /**
     * {@code POST  /ordereds} : Create a new ordered.
     *
     * @param ordered the ordered to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ordered, or with status {@code 400 (Bad Request)} if the ordered has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ordereds")
    public ResponseEntity<Ordered> createOrdered(@Valid @RequestBody Ordered ordered) throws URISyntaxException {
        log.debug("REST request to save Ordered : {}", ordered);
        if (ordered.getId() != null) {
            throw new BadRequestAlertException("A new ordered cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ordered result = orderedRepository.save(ordered);
        return ResponseEntity.created(new URI("/api/ordereds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ordereds} : Updates an existing ordered.
     *
     * @param ordered the ordered to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ordered,
     * or with status {@code 400 (Bad Request)} if the ordered is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ordered couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ordereds")
    public ResponseEntity<Ordered> updateOrdered(@Valid @RequestBody Ordered ordered) throws URISyntaxException {
        log.debug("REST request to update Ordered : {}", ordered);
        if (ordered.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Ordered result = orderedRepository.save(ordered);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ordered.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /ordereds} : get all the ordereds.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ordereds in body.
     */
    @GetMapping("/ordereds")
    public List<Ordered> getAllOrdereds() {
        log.debug("REST request to get all Ordereds");
        return orderedRepository.findAll();
    }

    /**
     * {@code GET  /ordereds/:id} : get the "id" ordered.
     *
     * @param id the id of the ordered to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ordered, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ordereds/{id}")
    public ResponseEntity<Ordered> getOrdered(@PathVariable Long id) {
        log.debug("REST request to get Ordered : {}", id);
        Optional<Ordered> ordered = orderedRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(ordered);
    }

    /**
     * {@code DELETE  /ordereds/:id} : delete the "id" ordered.
     *
     * @param id the id of the ordered to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ordereds/{id}")
    public ResponseEntity<Void> deleteOrdered(@PathVariable Long id) {
        log.debug("REST request to delete Ordered : {}", id);
        orderedRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
