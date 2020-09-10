package com.shaf.ebraire.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;

/**
 * A OrderLine.
 */
@Entity
@Table(name = "order_line")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "orderline")
public class OrderLine implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;
    @NotNull
    @Column(name = "quantity",columnDefinition = "integer default 1")
    private Integer quantity;
    @NotNull
    @Column(name = "price",nullable=false)
    private Float price;
    @NotNull
    @ManyToOne
    @JsonIgnoreProperties(value = "orderLines", allowSetters = true)
    private Book orderLines;
    @NotNull
    @ManyToOne
    @JsonIgnoreProperties(value = "oderedBooks", allowSetters = true)
    private Ordered order;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public OrderLine quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Float getPrice() {
        return price;
    }

    public OrderLine price(Float price) {
        this.price = price;
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Book getOrderLines() {
        return orderLines;
    }

    public OrderLine orderLines(Book book) {
        this.orderLines = book;
        return this;
    }

    public void setOrderLines(Book book) {
        this.orderLines = book;
    }

    public Ordered getOrder() {
        return order;
    }

    public OrderLine order(Ordered ordered) {
        this.order = ordered;
        return this;
    }

    public void setOrder(Ordered ordered) {
        this.order = ordered;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrderLine)) {
            return false;
        }
        return id != null && id.equals(((OrderLine) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrderLine{" +
            "id=" + getId() +
            ", quantity=" + getQuantity() +
            ", price=" + getPrice() +
            "}";
    }
}
