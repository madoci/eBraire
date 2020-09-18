package com.shaf.ebraire.web.rest;

import com.shaf.ebraire.EBraireApp;
import com.shaf.ebraire.domain.Ordered;
import com.shaf.ebraire.repository.OrderedRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.shaf.ebraire.domain.enumeration.Status;
/**
 * Integration tests for the {@link OrderedResource} REST controller.
 */
@SpringBootTest(classes = EBraireApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class OrderedResourceIT {

    private static final LocalDate DEFAULT_COMMAND_START = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_COMMAND_START = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DELEVRY_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_DELEVRY_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_BILLING_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_BILLING_ADDRESS = "BBBBBBBBBB";

    private static final Status DEFAULT_STATUS = Status.ORDERED;
    private static final Status UPDATED_STATUS = Status.SHIPPED;

    @Autowired
    private OrderedRepository orderedRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrderedMockMvc;

    private Ordered ordered;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ordered createEntity(EntityManager em) {
        Ordered ordered = new Ordered()
            .commandStart(DEFAULT_COMMAND_START)
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .delevryAddress(DEFAULT_DELEVRY_ADDRESS)
            .billingAddress(DEFAULT_BILLING_ADDRESS)
            .status(DEFAULT_STATUS);
        return ordered;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ordered createUpdatedEntity(EntityManager em) {
        Ordered ordered = new Ordered()
            .commandStart(UPDATED_COMMAND_START)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .delevryAddress(UPDATED_DELEVRY_ADDRESS)
            .billingAddress(UPDATED_BILLING_ADDRESS)
            .status(UPDATED_STATUS);
        return ordered;
    }

    @BeforeEach
    public void initTest() {
        ordered = createEntity(em);
    }

    @Test
    @Transactional
    public void createOrdered() throws Exception {
        int databaseSizeBeforeCreate = orderedRepository.findAll().size();
        // Create the Ordered
        restOrderedMockMvc.perform(post("/api/ordereds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ordered)))
            .andExpect(status().isCreated());

        // Validate the Ordered in the database
        List<Ordered> orderedList = orderedRepository.findAll();
        assertThat(orderedList).hasSize(databaseSizeBeforeCreate + 1);
        Ordered testOrdered = orderedList.get(orderedList.size() - 1);
        assertThat(testOrdered.getCommandStart()).isEqualTo(DEFAULT_COMMAND_START);
        assertThat(testOrdered.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testOrdered.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testOrdered.getDelevryAddress()).isEqualTo(DEFAULT_DELEVRY_ADDRESS);
        assertThat(testOrdered.getBillingAddress()).isEqualTo(DEFAULT_BILLING_ADDRESS);
        assertThat(testOrdered.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    public void createOrderedWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = orderedRepository.findAll().size();

        // Create the Ordered with an existing ID
        ordered.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderedMockMvc.perform(post("/api/ordereds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ordered)))
            .andExpect(status().isBadRequest());

        // Validate the Ordered in the database
        List<Ordered> orderedList = orderedRepository.findAll();
        assertThat(orderedList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkCommandStartIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderedRepository.findAll().size();
        // set the field null
        ordered.setCommandStart(null);

        // Create the Ordered, which fails.


        restOrderedMockMvc.perform(post("/api/ordereds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ordered)))
            .andExpect(status().isBadRequest());

        List<Ordered> orderedList = orderedRepository.findAll();
        assertThat(orderedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderedRepository.findAll().size();
        // set the field null
        ordered.setFirstName(null);

        // Create the Ordered, which fails.


        restOrderedMockMvc.perform(post("/api/ordereds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ordered)))
            .andExpect(status().isBadRequest());

        List<Ordered> orderedList = orderedRepository.findAll();
        assertThat(orderedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLastNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderedRepository.findAll().size();
        // set the field null
        ordered.setLastName(null);

        // Create the Ordered, which fails.


        restOrderedMockMvc.perform(post("/api/ordereds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ordered)))
            .andExpect(status().isBadRequest());

        List<Ordered> orderedList = orderedRepository.findAll();
        assertThat(orderedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDelevryAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderedRepository.findAll().size();
        // set the field null
        ordered.setDelevryAddress(null);

        // Create the Ordered, which fails.


        restOrderedMockMvc.perform(post("/api/ordereds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ordered)))
            .andExpect(status().isBadRequest());

        List<Ordered> orderedList = orderedRepository.findAll();
        assertThat(orderedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkBillingAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderedRepository.findAll().size();
        // set the field null
        ordered.setBillingAddress(null);

        // Create the Ordered, which fails.


        restOrderedMockMvc.perform(post("/api/ordereds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ordered)))
            .andExpect(status().isBadRequest());

        List<Ordered> orderedList = orderedRepository.findAll();
        assertThat(orderedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderedRepository.findAll().size();
        // set the field null
        ordered.setStatus(null);

        // Create the Ordered, which fails.


        restOrderedMockMvc.perform(post("/api/ordereds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ordered)))
            .andExpect(status().isBadRequest());

        List<Ordered> orderedList = orderedRepository.findAll();
        assertThat(orderedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllOrdereds() throws Exception {
        // Initialize the database
        orderedRepository.saveAndFlush(ordered);

        // Get all the orderedList
        restOrderedMockMvc.perform(get("/api/ordereds?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ordered.getId().intValue())))
            .andExpect(jsonPath("$.[*].commandStart").value(hasItem(DEFAULT_COMMAND_START.toString())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].delevryAddress").value(hasItem(DEFAULT_DELEVRY_ADDRESS)))
            .andExpect(jsonPath("$.[*].billingAddress").value(hasItem(DEFAULT_BILLING_ADDRESS)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
    
    @Test
    @Transactional
    public void getOrdered() throws Exception {
        // Initialize the database
        orderedRepository.saveAndFlush(ordered);

        // Get the ordered
        restOrderedMockMvc.perform(get("/api/ordereds/{id}", ordered.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ordered.getId().intValue()))
            .andExpect(jsonPath("$.commandStart").value(DEFAULT_COMMAND_START.toString()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.delevryAddress").value(DEFAULT_DELEVRY_ADDRESS))
            .andExpect(jsonPath("$.billingAddress").value(DEFAULT_BILLING_ADDRESS))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingOrdered() throws Exception {
        // Get the ordered
        restOrderedMockMvc.perform(get("/api/ordereds/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOrdered() throws Exception {
        // Initialize the database
        orderedRepository.saveAndFlush(ordered);

        int databaseSizeBeforeUpdate = orderedRepository.findAll().size();

        // Update the ordered
        Ordered updatedOrdered = orderedRepository.findById(ordered.getId()).get();
        // Disconnect from session so that the updates on updatedOrdered are not directly saved in db
        em.detach(updatedOrdered);
        updatedOrdered
            .commandStart(UPDATED_COMMAND_START)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .delevryAddress(UPDATED_DELEVRY_ADDRESS)
            .billingAddress(UPDATED_BILLING_ADDRESS)
            .status(UPDATED_STATUS);

        restOrderedMockMvc.perform(put("/api/ordereds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedOrdered)))
            .andExpect(status().isOk());

        // Validate the Ordered in the database
        List<Ordered> orderedList = orderedRepository.findAll();
        assertThat(orderedList).hasSize(databaseSizeBeforeUpdate);
        Ordered testOrdered = orderedList.get(orderedList.size() - 1);
        assertThat(testOrdered.getCommandStart()).isEqualTo(UPDATED_COMMAND_START);
        assertThat(testOrdered.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testOrdered.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testOrdered.getDelevryAddress()).isEqualTo(UPDATED_DELEVRY_ADDRESS);
        assertThat(testOrdered.getBillingAddress()).isEqualTo(UPDATED_BILLING_ADDRESS);
        assertThat(testOrdered.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    public void updateNonExistingOrdered() throws Exception {
        int databaseSizeBeforeUpdate = orderedRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderedMockMvc.perform(put("/api/ordereds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ordered)))
            .andExpect(status().isBadRequest());

        // Validate the Ordered in the database
        List<Ordered> orderedList = orderedRepository.findAll();
        assertThat(orderedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOrdered() throws Exception {
        // Initialize the database
        orderedRepository.saveAndFlush(ordered);

        int databaseSizeBeforeDelete = orderedRepository.findAll().size();

        // Delete the ordered
        restOrderedMockMvc.perform(delete("/api/ordereds/{id}", ordered.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ordered> orderedList = orderedRepository.findAll();
        assertThat(orderedList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
