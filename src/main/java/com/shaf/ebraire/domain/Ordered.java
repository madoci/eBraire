package com.shaf.ebraire.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

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
public class Ordered implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "command_start", nullable = false)
    private LocalDate commandStart;

    @NotNull
    @Column(name = "delevry_address", nullable = false)
    private String delevryAddress;

    @NotNull
    @Column(name = "billing_address", nullable = false)
    private String billingAddress;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<OrderLine> orderLines = new HashSet<>();

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

    public Set<OrderLine> getOrderLines() {
        return orderLines;
    }

    public Ordered orderLines(Set<OrderLine> orderLines) {
        this.orderLines = orderLines;
        return this;
    }

    public Ordered addOrderLines(OrderLine orderLine) {
        this.orderLines.add(orderLine);
        orderLine.setOrder(this);
        return this;
    }

    public Ordered removeOrderLines(OrderLine orderLine) {
        this.orderLines.remove(orderLine);
        orderLine.setOrder(null);
        return this;
    }

    public void setOrderLines(Set<OrderLine> orderLines) {
        this.orderLines = orderLines;
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
