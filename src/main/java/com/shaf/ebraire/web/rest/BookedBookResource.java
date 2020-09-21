package com.shaf.ebraire.web.rest;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shaf.ebraire.domain.Book;
import com.shaf.ebraire.domain.BookedBook;
import com.shaf.ebraire.domain.OrderLine;
import com.shaf.ebraire.domain.Ordered;
import com.shaf.ebraire.repository.BookRepository;
import com.shaf.ebraire.repository.BookedBookRepository;
import com.shaf.ebraire.repository.OrderLineRepository;
import com.shaf.ebraire.repository.OrderedRepository;
import com.shaf.ebraire.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

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


    private final BookRepository bookRepository;
    
    private final OrderLineRepository orderLineRepository;

    private final OrderedRepository orderedRepository;

    private final int bookedTime = 10000;
    public BookedBookResource(OrderedRepository orderedRepository,OrderLineRepository orderLineRepository, BookedBookRepository bookedBookRepository, BookRepository bookRepository) {
        this.bookedBookRepository = bookedBookRepository;
        this.bookRepository = bookRepository;
        this.orderLineRepository = orderLineRepository;
        this.orderedRepository = orderedRepository;
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
        long timeMilliExp = date.getTime();
        for(BookedBook bookedBooktoRemove:bookedBookRepository.getExpiredBookedBook(timeMilliExp)) {
        	bookedBooktoRemove.getBook().setQuantity(bookedBooktoRemove.getBook().getQuantity() + bookedBooktoRemove.getQuantity());
            Book result = bookRepository.save(bookedBooktoRemove.getBook());
        }
        bookedBookRepository.removeExpiredBookedBook(timeMilliExp);
        Optional<Book> currentBook = bookRepository.findOneWithEagerRelationships(bookedBook.getBook().getId());
        if (currentBook.isEmpty()) {
        	return ResponseEntity.created(new URI("/api/booked-books/" + "0"))
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, "0"))
                    .body(null);
        }
        BookedBook resultFinal= new BookedBook();
        if (currentBook.get().getQuantity() - bookedBook.getQuantity() >= 0 ) {//throw err TODO
        	currentBook.get().setQuantity(currentBook.get().getQuantity() - bookedBook.getQuantity());
            Book result = bookRepository.save(currentBook.get());
            long timeMilli = date.getTime() + bookedTime;
            bookedBook.setExpired( timeMilli);
            resultFinal = bookedBookRepository.save(bookedBook);
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
    @PostMapping("/booked-books-update")
    public ResponseEntity<BookedBook> updateBookedBook(@RequestBody BookedBook bookedBook) throws URISyntaxException {
    	try {  
        if (bookedBook.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        long timeMilli ;
        Date date = new Date();
        BookedBook resultFinal=null;
        Optional<Book> currentBook = bookRepository.findOneWithEagerRelationships(bookedBook.getBook().getId());
        if (currentBook.isEmpty()) { // cas ou le livre n'est plus
            long timeMilliExp = date.getTime();
            for(BookedBook bookedBooktoRemove:bookedBookRepository.getExpiredBookedBook(timeMilliExp)) {
            	bookedBooktoRemove.getBook().setQuantity(bookedBooktoRemove.getBook().getQuantity() + bookedBooktoRemove.getQuantity());
                Book result = bookRepository.save(bookedBooktoRemove.getBook());
            }
            bookedBookRepository.removeExpiredBookedBook(timeMilliExp);
        	return ResponseEntity.created(new URI("/api/booked-books/" + "0"))
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, "0"))
                    .body(bookedBook);
        }
        BookedBook newBookedBook;
        Optional<BookedBook> previousBookedBook = bookedBookRepository.findById(bookedBook.getId());
        if (previousBookedBook.isEmpty()) { // si il a été détruit
        	newBookedBook= new BookedBook();
        	newBookedBook.setQuantity(0);
        	newBookedBook.setBook(bookedBook.getBook());
            timeMilli = date.getTime() + bookedTime;
            newBookedBook.setExpired(timeMilli);
            newBookedBook.setId(bookedBook.getId());
        }else {
        	log.debug("existe encore");
        	newBookedBook= previousBookedBook.get();
        }
        int quantity = bookedBook.getQuantity() -newBookedBook.getQuantity();
        if (currentBook.get().getQuantity() - quantity >= 0 ) { //on essaye de crée 
        	log.debug("assez de quantité");
        	currentBook.get().setQuantity(currentBook.get().getQuantity() - quantity);
            Book resultbook = bookRepository.save(currentBook.get());
            timeMilli = date.getTime() + bookedTime;
            newBookedBook.setExpired(timeMilli);
            newBookedBook.setQuantity(bookedBook.getQuantity());
            resultFinal = bookedBookRepository.save(newBookedBook);
            long timeMilliExp = date.getTime();
            for(BookedBook bookedBooktoRemove:bookedBookRepository.getExpiredBookedBook(timeMilliExp)) {
            	bookedBooktoRemove.getBook().setQuantity(bookedBooktoRemove.getBook().getQuantity() + bookedBooktoRemove.getQuantity());
                Book result = bookRepository.save(bookedBooktoRemove.getBook());
            }
            bookedBookRepository.removeExpiredBookedBook(timeMilliExp);
            return ResponseEntity.created(new URI("/api/booked-books/" + resultFinal.getId()))
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, resultFinal.getId().toString()))
                    .body(resultFinal);
        }else  if (previousBookedBook.isEmpty()){ // cas expiré pas assez de quantitté
            long timeMilliExp = date.getTime();
            for(BookedBook bookedBooktoRemove:bookedBookRepository.getExpiredBookedBook(timeMilliExp)) {
            	bookedBooktoRemove.getBook().setQuantity(bookedBooktoRemove.getBook().getQuantity() + bookedBooktoRemove.getQuantity());
                Book result = bookRepository.save(bookedBooktoRemove.getBook());
            }
            bookedBookRepository.removeExpiredBookedBook(timeMilliExp);
        	log.debug("pas assez!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        	bookedBook.setQuantity(0);
        	return ResponseEntity.created(new URI("/api/booked-books/" + "0"))
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, "0"))
                    .body(bookedBook);
        }else {    // cas pas expirer assez de quantité 
                long timeMilliExp = date.getTime();
                for(BookedBook bookedBooktoRemove:bookedBookRepository.getExpiredBookedBook(timeMilliExp)) {
                	bookedBooktoRemove.getBook().setQuantity(bookedBooktoRemove.getBook().getQuantity() + bookedBooktoRemove.getQuantity());
                    Book result = bookRepository.save(bookedBooktoRemove.getBook());
                }
                bookedBookRepository.removeExpiredBookedBook(timeMilliExp);
            	log.debug("pas assez!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            	bookedBook.setQuantity(0);
            	return ResponseEntity.created(new URI("/api/booked-books/" + previousBookedBook.get().getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, previousBookedBook.get().getId().toString()))
                        .body(previousBookedBook.get());
            }
   	 } catch (Exception e) {
         	log.debug("pas assez!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
         	bookedBook.setQuantity(0);
         	return ResponseEntity.created(new URI("/api/booked-books/" + "0"))
                     .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, "0"))
                     .body(bookedBook);
         
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
        bookedbook.getBook().setQuantity(bookedbook.getBook().getQuantity() + bookedbook.getQuantity());
        Book result = bookRepository.save(bookedbook.getBook());
        bookedBookRepository.deleteById(id);
        }else {
        	
        }
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
    
    @DeleteMapping("/booked-books-from-customer/{id}")
    public ResponseEntity<Void> deleteBookedBookOfCustomer(@PathVariable Long id) {
        log.debug("REST request to delete BookedBook from Customer : {}", id);
        List<BookedBook> temp = bookedBookRepository.getFromCustomer(id);
        for (BookedBook bookedbook:temp) {
        	bookedbook.getBook().setQuantity(bookedbook.getBook().getQuantity() + bookedbook.getQuantity());
            Book result = bookRepository.save(bookedbook.getBook());
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
        	orderLine.setBook(bookedbook.getBook());
        	OrderLine result = orderLineRepository.save(orderLine);
            order.addOrderLines(orderLine);
        }
        Ordered result = orderedRepository.save(order);
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
        return null;
    }
    
    
    @PutMapping("/booked-books-check")
    public ResponseEntity<BookedBook> CheckBookedBook(@RequestBody BookedBook bookedBook){
    	log.debug("Check book : : {}", bookedBook);
        Date date = new Date();
        long timeMilliExp = date.getTime();
        for(BookedBook bookedBooktoRemove:bookedBookRepository.getExpiredBookedBook(timeMilliExp)) {
        	bookedBooktoRemove.getBook().setQuantity(bookedBooktoRemove.getBook().getQuantity() + bookedBooktoRemove.getQuantity());
            Book result = bookRepository.save(bookedBooktoRemove.getBook());
        }
        bookedBookRepository.removeExpiredBookedBook(timeMilliExp);
        if (bookedBook.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Optional<Book> currentBook = bookRepository.findOneWithEagerRelationships(bookedBook.getBook().getId());
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
                BookedBook result = bookedBookRepository.save(bookedBook);
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
        	if (previousBookedBook.getBook().getId().equals(bookedBook.getBook().getId())) {
        		if (previousBookedBook.getQuantity() == bookedBook.getQuantity()) {
        			//majTIMER
        	        long timeMilli = date.getTime() + bookedTime;
        	        bookedBook.setExpired(timeMilli);
                    BookedBook result = bookedBookRepository.save(bookedBook);
        			return ResponseEntity.ok()
        		            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookedBook.getId().toString()))
        		            .body(result); 
        		}else {
        			//majQuantity
    	            return ResponseEntity.ok()
        	                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, previousBookedBook.getId().toString()))
        	                    .body(previousBookedBook); 	
        		}
        	}else {
        	}	
        }
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookedBook.getId().toString()))
            .body(null); 	
    }

    
}
