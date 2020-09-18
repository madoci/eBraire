package com.shaf.ebraire.web.rest;
import java.time.LocalDateTime;  
import com.shaf.ebraire.domain.Book;
import com.shaf.ebraire.domain.Ordered;
import com.shaf.ebraire.domain.OrderLine;
import com.shaf.ebraire.domain.BookedBook;
import com.shaf.ebraire.repository.BookRepository;
import com.shaf.ebraire.repository.BookedBookRepository;
import com.shaf.ebraire.repository.OrderLineRepository;
import com.shaf.ebraire.repository.OrderedRepository;
import com.shaf.ebraire.repository.search.BookSearchRepository;
import com.shaf.ebraire.repository.search.BookedBookSearchRepository;
import com.shaf.ebraire.repository.search.OrderLineSearchRepository;
import com.shaf.ebraire.repository.search.OrderedSearchRepository;
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
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.shaf.ebraire.domain.BookedBook}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BookedBookResource {

    private final Logger log = LoggerFactory.getLogger(BookedBookResource.class);

    private static final String ENTITY_NAME = "bookedBook";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookedBookRepository bookedBookRepository;

    private final BookedBookSearchRepository bookedBookSearchRepository;

    private final BookRepository bookRepository;

    private final BookSearchRepository bookSearchRepository;
    
    private final OrderLineRepository orderLineRepository;

    private final OrderLineSearchRepository orderLineSearchRepository;

    private final OrderedRepository orderedRepository;

    private final OrderedSearchRepository orderedSearchRepository;

    public BookedBookResource(OrderedRepository orderedRepository, OrderedSearchRepository orderedSearchRepository,OrderLineRepository orderLineRepository, OrderLineSearchRepository orderLineSearchRepository,BookedBookRepository bookedBookRepository, BookedBookSearchRepository bookedBookSearchRepository,BookRepository bookRepository, BookSearchRepository bookSearchRepository) {
        this.bookedBookRepository = bookedBookRepository;
        this.bookedBookSearchRepository = bookedBookSearchRepository;
        this.bookRepository = bookRepository;
        this.bookSearchRepository = bookSearchRepository;
        this.orderLineRepository = orderLineRepository;
        this.orderLineSearchRepository = orderLineSearchRepository;
        this.orderedRepository = orderedRepository;
        this.orderedSearchRepository = orderedSearchRepository;
    }

    /**
     * {@code POST  /booked-books} : Create a new bookedBook.
     *
     * @param bookedBook the bookedBook to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bookedBook, or with status {@code 400 (Bad Request)} if the bookedBook has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/booked-books")
    public ResponseEntity<BookedBook> createBookedBook(@RequestBody BookedBook bookedBook) throws URISyntaxException {
        log.debug("REST request to save BookedBook : {}", bookedBook);
        if (bookedBook.getId() != null) {
            throw new BadRequestAlertException("A new bookedBook cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Date date = new Date();
        long timeMilliExp = date.getTime() + 60000;
        log.debug("taille : {} ", bookedBookRepository.getExpiredBookedBook(timeMilliExp)); 
        Optional<Book> currentBook = bookRepository.findOneWithEagerRelationships(bookedBook.book.getId());
        if (currentBook.isEmpty()) {
        	return ResponseEntity.created(new URI("/api/booked-books/" + "0"))
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, "0"))
                    .body(null);
        }
        BookedBook resultFinal= new BookedBook();
        if (currentBook.get().getQuantity() - bookedBook.getQuantity() >= 0 ) {//throw err TODO
        	currentBook.get().setQuantity(currentBook.get().getQuantity() - bookedBook.getQuantity());
            Book result = bookRepository.save(currentBook.get());
            bookSearchRepository.save(result);
            //Getting the current date
            //This method returns the time in millis
            long timeMilli = date.getTime();
            bookedBook.setExpired( timeMilli);
            resultFinal = bookedBookRepository.save(bookedBook);
            bookedBookSearchRepository.save(resultFinal);
            return ResponseEntity.created(new URI("/api/booked-books/" + bookedBook.getId()))
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, bookedBook.getId().toString()))
                    .body(resultFinal);
        }else {
            return ResponseEntity.created(new URI("/api/booked-books/" + "0"))
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, "0"))
                    .body(null);
        }
    }

    /**
     * {@code PUT  /booked-books} : Updates an existing bookedBook.
     *
     * @param bookedBook the bookedBook to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookedBook,
     * or with status {@code 400 (Bad Request)} if the bookedBook is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bookedBook couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/booked-books")
    public ResponseEntity<BookedBook> updateBookedBook(@RequestBody BookedBook bookedBook) throws URISyntaxException {
        log.debug("UPDATETEEEEEEEE!!!!!!! : {}", bookedBook);
        if (bookedBook.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        BookedBook resultFinal=null;
        Optional<Book> currentBook = bookRepository.findOneWithEagerRelationships(bookedBook.book.getId());
        if (currentBook.isEmpty()) {
        	return ResponseEntity.ok()
                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookedBook.getId().toString()))
                    .body(null); 	
        }
        Optional<BookedBook> previousBookedBook = bookedBookRepository.findById(bookedBook.getId());
        int quantity = bookedBook.getQuantity() -previousBookedBook.get().getQuantity();
        if (currentBook.get().getQuantity() - quantity >= 0 ) { //throw err TODO
        	currentBook.get().setQuantity(currentBook.get().getQuantity() - quantity);
            Book resultbook = bookRepository.save(currentBook.get());
            bookSearchRepository.save(resultbook);
            //Getting the current date
            Date date = new Date();
            //This method returns the time in millis
            long timeMilli = date.getTime();
            bookedBook.setExpired(timeMilli);
            resultFinal = bookedBookRepository.save(bookedBook);
            bookedBookSearchRepository.save(resultFinal);
            return ResponseEntity.created(new URI("/api/booked-books/" + bookedBook.getId()))
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, bookedBook.getId().toString()))
                    .body(resultFinal);
        }else {
        	return ResponseEntity.created(new URI("/api/booked-books/" + "0"))
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, "0"))
                    .body(null);
        }
    }

    /**
     * {@code GET  /booked-books} : get all the bookedBooks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bookedBooks in body.
     */
    @GetMapping("/booked-books")
    public List<BookedBook> getAllBookedBooks() {
        log.debug("REST request to get all BookedBooks");
        return bookedBookRepository.findAll();
    }

    /**
     * {@code GET  /booked-books/:id} : get the "id" bookedBook.
     *
     * @param id the id of the bookedBook to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bookedBook, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/booked-books/{id}")
    public ResponseEntity<BookedBook> getBookedBook(@PathVariable Long id) {
        log.debug("REST request to get BookedBook : {}", id);
        Optional<BookedBook> bookedBook = bookedBookRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bookedBook);
    }

    /**
     * {@code DELETE  /booked-books/:id} : delete the "id" bookedBook.
     *
     * @param id the id of the bookedBook to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/booked-books/{id}")
    public ResponseEntity<Void> deleteBookedBook(@PathVariable Long id) {
        log.debug("REST request to delete BookedBook : {}", id);
        Optional<BookedBook> optBooked = bookedBookRepository.findById(id);
        if (!optBooked.isEmpty()) {
        BookedBook bookedbook = optBooked.get();
        bookedbook.book.setQuantity(bookedbook.book.getQuantity() + bookedbook.getQuantity());
        Book result = bookRepository.save(bookedbook.book);
        bookSearchRepository.save(result);
        }else {
        	//throw err TODO
        }
        bookedBookRepository.deleteById(id);
        bookedBookSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
    
    @DeleteMapping("/booked-books-from-customer/{id}")
    public ResponseEntity<Void> deleteBookedBookOfCustomer(@PathVariable Long id) {
        log.debug("REST request to delete BookedBook from Customer : {}", id);
        List<BookedBook> temp = bookedBookRepository.getFromCustomer(id);
        for (BookedBook bookedbook:temp) {
        	bookedbook.book.setQuantity(bookedbook.book.getQuantity() + bookedbook.getQuantity());
            Book result = bookRepository.save(bookedbook.book);
            bookSearchRepository.save(result);
        }
        bookedBookRepository.deleteFromCustomer(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
    
    
    @DeleteMapping("/order-booked-books-from-customer/{id}/{idOrder}")
    public ResponseEntity<Void> OrderBookedBookOfCustomer(@PathVariable Long id,@PathVariable Long idOrder ) {
        log.debug("REST request to order BookedBook from Customer : {}", idOrder);
        List<BookedBook> temp = bookedBookRepository.getFromCustomer(id);
        Ordered order = orderedRepository.findById(idOrder).get();
        for (BookedBook bookedbook:temp) {
        	OrderLine orderLine = new OrderLine();
        	orderLine.setQuantity(bookedbook.getQuantity());
        	orderLine.setOrder(order);
        	orderLine.setPrice(bookedbook.getPrice());
        	orderLine.setOrderLines(bookedbook.getBook());
        	OrderLine result = orderLineRepository.save(orderLine);
            orderLineSearchRepository.save(result);
            order.addOderedBooks(orderLine);
        }
        Ordered result = orderedRepository.save(order);
        orderedSearchRepository.save(result);
        bookedBookRepository.deleteFromCustomer(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }


    /**
     * {@code SEARCH  /_search/booked-books?query=:query} : search for the bookedBook corresponding
     * to the query.
     *
     * @param query the query of the bookedBook search.
     * @return the result of the search.
     */
    @GetMapping("/_search/booked-books")
    public List<BookedBook> searchBookedBooks(@RequestParam String query ) {
        log.debug("REST request to search BookedBooks for query {}", query);
        return StreamSupport
            .stream(bookedBookSearchRepository.search(queryStringQuery(query)).spliterator(), false)
        .collect(Collectors.toList());
    }
    
    @GetMapping("/booked/{id}/{request}")
    public List<BookedBook> StillAllReservation(@PathVariable Long id) {
        log.debug("REST request to search BookedBooks for query {}", id);
		return null;
        
    }
    
    @PutMapping("/booked-books-check")
    public ResponseEntity<BookedBook> CheckBookedBook(@RequestBody BookedBook bookedBook){
    	log.debug("Check book : : {}", bookedBook);
        if (bookedBook.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Optional<Book> currentBook = bookRepository.findOneWithEagerRelationships(bookedBook.book.getId());
        if (currentBook.isEmpty()) {
        	return ResponseEntity.ok()
                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookedBook.getId().toString()))
                    .body(null); 	
        }
        Optional<BookedBook> optionalPreviousBookedBook = bookedBookRepository.findById(bookedBook.getId());
        if(optionalPreviousBookedBook.isEmpty()) {
        	if (currentBook.get().getQuantity() - bookedBook.getQuantity() >= 0 ) {
        		currentBook.get().setQuantity(currentBook.get().getQuantity() - bookedBook.getQuantity());
                Book resultbook = bookRepository.save(currentBook.get());
                bookSearchRepository.save(resultbook);
                BookedBook result = bookedBookRepository.save(bookedBook);
                bookedBookSearchRepository.save(result);
                log.debug("recreation  success: :");
                return ResponseEntity.ok()
	                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
	                    .body(result); 	
            }else {
            	log.debug("recreation  Failed: :");
	        	return ResponseEntity.ok()
	                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookedBook.getId().toString()))
	                    .body(null); 	
	        }
        }else {
        	BookedBook previousBookedBook = optionalPreviousBookedBook.get();
        	log.debug("reservationt trouvé  ancien : : {}", currentBook.get());
        	log.debug("reservationt trouvé  neuf : : {}", currentBook.get());
        	if (previousBookedBook.book.getId().equals(bookedBook.book.getId())) {
        		log.debug("reservationt trouvé et livre similaire : : {}", bookedBook);
        		if (previousBookedBook.getQuantity() == bookedBook.getQuantity()) {
        			//majTIMER
        			log.debug("Tous c'est bien passer : :");
        			return ResponseEntity.ok()
        		            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookedBook.getId().toString()))
        		            .body(bookedBook); 
        		}else {
        			//majQuantity
    	            return ResponseEntity.ok()
        	                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, previousBookedBook.getId().toString()))
        	                    .body(previousBookedBook); 	
        		}
        	}else {
        		log.debug("livre incohérent  : :");
        	}	
        }
        log.debug("default : :");
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookedBook.getId().toString()))
            .body(null); 	
    }

    
}
