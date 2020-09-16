package com.shaf.ebraire.web.rest;

import com.shaf.ebraire.domain.Book;
import com.shaf.ebraire.domain.Genre;
import com.shaf.ebraire.domain.Tag;
import com.shaf.ebraire.repository.BookRepository;
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
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * REST controller for managing {@link com.shaf.ebraire.domain.Book}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BookResource {

    private final Logger log = LoggerFactory.getLogger(BookResource.class);

    private static final String ENTITY_NAME = "book";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookRepository bookRepository;

    public BookResource(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    /**
     * {@code POST  /books} : Create a new book.
     *
     * @param book the book to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new book, or with status {@code 400 (Bad Request)} if the book has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/books")
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) throws URISyntaxException {
        log.debug("REST request to save Book : {}", book);
        if (book.getId() != null) {
            throw new BadRequestAlertException("A new book cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Book result = bookRepository.save(book);
        return ResponseEntity.created(new URI("/api/books/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /books} : Updates an existing book.
     *
     * @param book the book to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated book,
     * or with status {@code 400 (Bad Request)} if the book is not valid,
     * or with status {@code 500 (Internal Server Error)} if the book couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/books")
    public ResponseEntity<Book> updateBook(@Valid @RequestBody Book book) throws URISyntaxException {
        log.debug("REST request to update Book : {}", book);
        if (book.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Book result = bookRepository.save(book);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, book.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /books} : get all the books.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of books in body.
     */
    @GetMapping("/books")
    public List<Book> getAllBooks(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Books");
        return bookRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /books/:id} : get the "id" book.
     *
     * @param id the id of the book to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the book, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/books/{id}")
    public ResponseEntity<Book> getBook(@PathVariable Long id) {
        log.debug("REST request to get Book : {}", id);
        Optional<Book> book = bookRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(book);
    }

     /**
     * {@code GET  /books/:title} : get the "title" book.
     *
     * @param title the title of the book to retrieve.
     * @return the list of book containing the title.
     */
    @GetMapping("/booksResearch/{title}")
    public List<Book>  getBook(@PathVariable String title) {
        log.debug("REST request to get Book : {}", title);
        List<Book> books = bookRepository.findBooksByTitle(title);
        
        return books;
    }

    /**
    * {@code GET  /books/:title} : get the "title" book.
    *
    * @param title the title of the book to retrieve.
    * @return the list of book containing the title.
    */
    @GetMapping("/booksResearch/{title}/{types}/{genres}/{tags}")
    public List<Book>  getBook(@PathVariable String title,@PathVariable String types,@PathVariable String genres,@PathVariable String tags) {
        
        List<Book> books;
        if (title.equals("title-") && types.equals("types-")) {
            log.debug("tous les livres");
            books = getAllBooks(true);
        } else if (types.equals("types-")) {
            books = bookRepository.findBooksByTitle(title.substring(6));
        }else if (title.equals("title-")){
            books = bookRepository.findBooksByFilter("",types.substring(6).split("&"));
        }else{
            books = bookRepository.findBooksByFilter(title.substring(6),types.substring(6).split("&"));
        }
        if (!(tags.contentEquals("tags-"))) {
            String[] tagList = tags.substring(5).split("&");
            List<Book> finalBooks = new ArrayList<>();
            for (int i =0;i<books.size();i++) {
                boolean haveTag = false;
                    for(Tag tag:books.get(i).getTags()) {
                        for (int j=0;j<tagList.length;j++) {
                            if(tagList[j].equals(tag.getTag())) {
                                haveTag = true;
                                break;
                            }
                        }
                        if (haveTag) {
                            break;
                        }
                    }
                    if (haveTag) {
                        finalBooks.add(books.get(i));
                    }		
            }
            books = finalBooks;
        }
        if (!(genres.contentEquals("genres-"))) {
            String[] genreList = genres.substring(7).split("&");
            List<Book> finalBooks = new ArrayList<>();
            for (int i =0;i<books.size();i++) {
                boolean havegenre = false;
                    for(Genre genre:books.get(i).getGenres()) {
                        for (int j=0;j<genreList.length;j++) {
                            if(genreList[j].equals(genre.getGenre())) {
                                havegenre = true;
                                break;
                            }
                        }
                        if (havegenre) {
                            break;
                        }
                    }
                    if (havegenre) {
                        finalBooks.add(books.get(i));
                    }		
            }
            books = finalBooks;
        }
        return books;
    }

    /**
     * {@code DELETE  /books/:id} : delete the "id" book.
     *
     * @param id the id of the book to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        log.debug("REST request to delete Book : {}", id);
        bookRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
