package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "fields")
public class Field {

    @Id
    private String id;

    @Column(name = "field_name")
    private String fieldName;

    @Column(name = "sports_type")
    private String sportsType;

    private String address;

    private BigDecimal price;

    private Double rating;

    @Column(name = "sports_center_id")
    private String sportsCenterId;

    private String description;

    @Column(name = "owner_id")
    private Long ownerId;

    private String status;

    public Field() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getSportsType() {
        return sportsType;
    }

    public void setSportsType(String sportsType) {
        this.sportsType = sportsType;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getSportsCenterId() {
        return sportsCenterId;
    }

    public void setSportsCenterId(String sportsCenterId) {
        this.sportsCenterId = sportsCenterId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
