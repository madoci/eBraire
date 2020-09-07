package com.shaf.ebraire.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.shaf.ebraire.domain.enumeration.Status;

/**
 * A Ordered.
 */
@Entity
@Table(name = "ordered")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "ordered")
public class Ordered implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "command_start")
    private LocalDate commandStart;

    @Column(name = "delevry_address")
    private String delevryAddress;

    @Column(name = "billing_address")
    private String billingAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @OneToMany(mappedBy = "order")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<OrderLine> oderedBooks = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = "idOrders", allowSetters = true)
    private Customer idCustomer;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getCommandStart() {
        return commandStart;
    }

    public Ordered commandStart(LocalDate commandStart) {
        this.commandStart = commandStart;
        return this;
    }

    public void setCommandStart(LocalDate commandStart) {
        this.commandStart = commandStart;
    }

    public String getDelevryAddress() {
        return delevryAddress;
    }

    public Ordered delevryAddress(String delevryAddress) {
        this.delevryAddress = delevryAddress;
        return this;
    }

    public void setDelevryAddress(String delevryAddress) {
        this.delevryAddress = delevryAddress;
    }

    public String getBillingAddress() {
        return billingAddress;
    }

    public Ordered billingAddress(String billingAddress) {
        this.billingAddress = billingAddress;
        return this;
    }

    public void setBillingAddress(String billingAddress) {
        this.billingAddress = billingAddress;
    }

    public Status getStatus() {
        return status;
    }

    public Ordered status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Set<OrderLine> getOderedBooks() {
        return oderedBooks;
    }

    public Ordered oderedBooks(Set<OrderLine> orderLines) {
        this.oderedBooks = orderLines;
        return this;
    }

    public Ordered addOderedBooks(OrderLine orderLine) {
        this.oderedBooks.add(orderLine);
        orderLine.setOrder(this);
        return this;
    }

    public Ordered removeOderedBooks(OrderLine orderLine) {
        this.oderedBooks.remove(orderLine);
        orderLine.setOrder(null);
        return this;
    }

    public void setOderedBooks(Set<OrderLine> orderLines) {
        this.oderedBooks = orderLines;
    }

    public Customer getIdCustomer() {
        return idCustomer;
    }

    public Ordered idCustomer(Customer customer) {
        this.idCustomer = customer;
        return this;
    }

    public void setIdCustomer(Customer customer) {
        this.idCustomer = customer;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ordered)) {
            return false;
        }
        return id != null && id.equals(((Ordered) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ordered{" +
            "id=" + getId() +
            ", commandStart='" + getCommandStart() + "'" +
            ", delevryAddress='" + getDelevryAddress() + "'" +
            ", billingAddress='" + getBillingAddress() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
