package com.shaf.ebraire.web.rest;

import com.shaf.ebraire.EBraireApp;
import com.shaf.ebraire.domain.BookedBook;
import com.shaf.ebraire.repository.BookedBookRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link BookedBookResource} REST controller.
 */
@SpringBootTest(classes = EBraireApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class BookedBookResourceIT {
/*
    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final Float DEFAULT_PRICE = 1F;
    private static final Float UPDATED_PRICE = 2F;

    private static final Long DEFAULT_EXPIRED = 1L;
    private static final Long UPDATED_EXPIRED = 2L;

    @Autowired
    private BookedBookRepository bookedBookRepository;

    /**
     * This repository is mocked in the com.shaf.ebraire.repository.search test package.
     *
     * @see com.shaf.ebraire.repository.search.BookedBookSearchRepositoryMockConfiguration
     */

/*    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBookedBookMockMvc;

    private BookedBook bookedBook;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
/*public static BookedBook createEntity(EntityManager em) {
        BookedBook bookedBook = new BookedBook()
            .quantity(DEFAULT_QUANTITY)
            .price(DEFAULT_PRICE)
            .expired(DEFAULT_EXPIRED);
        return bookedBook;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
  /*  public static BookedBook createUpdatedEntity(EntityManager em) {
        BookedBook bookedBook = new BookedBook()
            .quantity(UPDATED_QUANTITY)
            .price(UPDATED_PRICE)
            .expired(UPDATED_EXPIRED);
        return bookedBook;
    }

    @BeforeEach
    public void initTest() {
        bookedBook = createEntity(em);
    }

    @Test
    @Transactional
    public void createBookedBook() throws Exception {
        int databaseSizeBeforeCreate = bookedBookRepository.findAll().size();
        // Create the BookedBook
        restBookedBookMockMvc.perform(post("/api/booked-books")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bookedBook)))
            .andExpect(status().isCreated());

        // Validate the BookedBook in the database
        List<BookedBook> bookedBookList = bookedBookRepository.findAll();
        assertThat(bookedBookList).hasSize(databaseSizeBeforeCreate + 1);
        BookedBook testBookedBook = bookedBookList.get(bookedBookList.size() - 1);
        assertThat(testBookedBook.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testBookedBook.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testBookedBook.getExpired()).isEqualTo(DEFAULT_EXPIRED);

    }

    @Test
    @Transactional
    public void createBookedBookWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = bookedBookRepository.findAll().size();

        // Create the BookedBook with an existing ID
        bookedBook.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBookedBookMockMvc.perform(post("/api/booked-books")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bookedBook)))
            .andExpect(status().isBadRequest());

        // Validate the BookedBook in the database
        List<BookedBook> bookedBookList = bookedBookRepository.findAll();
        assertThat(bookedBookList).hasSize(databaseSizeBeforeCreate);

    }


    @Test
    @Transactional
    public void getAllBookedBooks() throws Exception {
        // Initialize the database
        bookedBookRepository.saveAndFlush(bookedBook);

        // Get all the bookedBookList
        restBookedBookMockMvc.perform(get("/api/booked-books?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bookedBook.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].expired").value(hasItem(DEFAULT_EXPIRED.intValue())));
    }

    @Test
    @Transactional
    public void getBookedBook() throws Exception {
        // Initialize the database
        bookedBookRepository.saveAndFlush(bookedBook);

        // Get the bookedBook
        restBookedBookMockMvc.perform(get("/api/booked-books/{id}", bookedBook.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bookedBook.getId().intValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.expired").value(DEFAULT_EXPIRED.intValue()));
    }
    @Test
    @Transactional
    public void getNonExistingBookedBook() throws Exception {
        // Get the bookedBook
        restBookedBookMockMvc.perform(get("/api/booked-books/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBookedBook() throws Exception {
        // Initialize the database
        bookedBookRepository.saveAndFlush(bookedBook);

        int databaseSizeBeforeUpdate = bookedBookRepository.findAll().size();

        // Update the bookedBook
        BookedBook updatedBookedBook = bookedBookRepository.findById(bookedBook.getId()).get();
        // Disconnect from session so that the updates on updatedBookedBook are not directly saved in db
        em.detach(updatedBookedBook);
        updatedBookedBook
            .quantity(UPDATED_QUANTITY)
            .price(UPDATED_PRICE)
            .expired(UPDATED_EXPIRED);

        restBookedBookMockMvc.perform(put("/api/booked-books")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedBookedBook)))
            .andExpect(status().isOk());

        // Validate the BookedBook in the database
        List<BookedBook> bookedBookList = bookedBookRepository.findAll();
        assertThat(bookedBookList).hasSize(databaseSizeBeforeUpdate);
        BookedBook testBookedBook = bookedBookList.get(bookedBookList.size() - 1);
        assertThat(testBookedBook.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testBookedBook.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testBookedBook.getExpired()).isEqualTo(UPDATED_EXPIRED);

    }

    @Test
    @Transactional
    public void updateNonExistingBookedBook() throws Exception {
        int databaseSizeBeforeUpdate = bookedBookRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookedBookMockMvc.perform(put("/api/booked-books")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bookedBook)))
            .andExpect(status().isBadRequest());

        // Validate the BookedBook in the database
        List<BookedBook> bookedBookList = bookedBookRepository.findAll();
        assertThat(bookedBookList).hasSize(databaseSizeBeforeUpdate);

    }

    @Test
    @Transactional
    public void deleteBookedBook() throws Exception {
        // Initialize the database
        bookedBookRepository.saveAndFlush(bookedBook);

        int databaseSizeBeforeDelete = bookedBookRepository.findAll().size();

        // Delete the bookedBook
        restBookedBookMockMvc.perform(delete("/api/booked-books/{id}", bookedBook.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BookedBook> bookedBookList = bookedBookRepository.findAll();
        assertThat(bookedBookList).hasSize(databaseSizeBeforeDelete - 1);

    }

    @Test
    @Transactional
    public void searchBookedBook() throws Exception {

        // Search the bookedBook
        restBookedBookMockMvc.perform(get("/api/_search/booked-books?query=id:" + bookedBook.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bookedBook.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].expired").value(hasItem(DEFAULT_EXPIRED.intValue())));
    }*/
}
