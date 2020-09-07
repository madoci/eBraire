package com.shaf.ebraire.web.rest;

import com.shaf.ebraire.domain.Genre;
import com.shaf.ebraire.repository.GenreRepository;
import com.shaf.ebraire.repository.search.GenreSearchRepository;
import com.shaf.ebraire.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.shaf.ebraire.domain.Genre}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GenreResource {

    private final Logger log = LoggerFactory.getLogger(GenreResource.class);

    private static final String ENTITY_NAME = "genre";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GenreRepository genreRepository;

    private final GenreSearchRepository genreSearchRepository;

    public GenreResource(GenreRepository genreRepository, GenreSearchRepository genreSearchRepository) {
        this.genreRepository = genreRepository;
        this.genreSearchRepository = genreSearchRepository;
    }

    /**
     * {@code POST  /genres} : Create a new genre.
     *
     * @param genre the genre to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new genre, or with status {@code 400 (Bad Request)} if the genre has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/genres")
    public ResponseEntity<Genre> createGenre(@RequestBody Genre genre) throws URISyntaxException {
        log.debug("REST request to save Genre : {}", genre);
        if (genre.getId() != null) {
            throw new BadRequestAlertException("A new genre cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Genre result = genreRepository.save(genre);
        genreSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/genres/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /genres} : Updates an existing genre.
     *
     * @param genre the genre to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated genre,
     * or with status {@code 400 (Bad Request)} if the genre is not valid,
     * or with status {@code 500 (Internal Server Error)} if the genre couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/genres")
    public ResponseEntity<Genre> updateGenre(@RequestBody Genre genre) throws URISyntaxException {
        log.debug("REST request to update Genre : {}", genre);
        if (genre.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Genre result = genreRepository.save(genre);
        genreSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, genre.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /genres} : get all the genres.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of genres in body.
     */
    @GetMapping("/genres")
    public List<Genre> getAllGenres() {
        log.debug("REST request to get all Genres");
        return genreRepository.findAll();
    }

    /**
     * {@code GET  /genres/:id} : get the "id" genre.
     *
     * @param id the id of the genre to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the genre, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/genres/{id}")
    public ResponseEntity<Genre> getGenre(@PathVariable Long id) {
        log.debug("REST request to get Genre : {}", id);
        Optional<Genre> genre = genreRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(genre);
    }

    /**
     * {@code DELETE  /genres/:id} : delete the "id" genre.
     *
     * @param id the id of the genre to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/genres/{id}")
    public ResponseEntity<Void> deleteGenre(@PathVariable Long id) {
        log.debug("REST request to delete Genre : {}", id);
        genreRepository.deleteById(id);
        genreSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/genres?query=:query} : search for the genre corresponding
     * to the query.
     *
     * @param query the query of the genre search.
     * @return the result of the search.
     */
    @GetMapping("/_search/genres")
    public List<Genre> searchGenres(@RequestParam String query) {
        log.debug("REST request to search Genres for query {}", query);
        return StreamSupport
            .stream(genreSearchRepository.search(queryStringQuery(query)).spliterator(), false)
        .collect(Collectors.toList());
    }
}
