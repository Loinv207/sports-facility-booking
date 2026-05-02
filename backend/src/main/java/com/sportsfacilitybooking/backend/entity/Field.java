package com.sportsfacilitybooking.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(name = "sports_type_id")
    private Integer sportsTypeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sports_type_id", insertable = false, updatable = false)
    @JsonIgnore
    private SportsType sportsTypeRef;

    private String address;

    private BigDecimal price;

    private Double rating;

    @Column(name = "sports_center_id")
    private String sportsCenterId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sports_center_id", insertable = false, updatable = false)
    private SportsCenter sportsCenter;

    private String description;

    @Column(name = "owner_id")
    private Long ownerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", insertable = false, updatable = false)
    private User owner;

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

    public Integer getSportsTypeId() {
        return sportsTypeId;
    }

    public void setSportsTypeId(Integer sportsTypeId) {
        this.sportsTypeId = sportsTypeId;
    }

    public SportsType getSportsTypeRef() {
        return sportsTypeRef;
    }

    public void setSportsTypeRef(SportsType sportsTypeRef) {
        this.sportsTypeRef = sportsTypeRef;
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

    public SportsCenter getSportsCenter() {
        return sportsCenter;
    }

    public void setSportsCenter(SportsCenter sportsCenter) {
        this.sportsCenter = sportsCenter;
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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
