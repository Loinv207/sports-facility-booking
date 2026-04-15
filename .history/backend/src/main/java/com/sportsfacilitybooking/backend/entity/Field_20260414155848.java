

package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fields")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Field {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "field_name")
    private String fieldName;

    @ManyToOne
    @JoinColumn(name = "center_id")
    private SportsCenter sportsCenter;

    @ManyToOne
    @JoinColumn(name = "sports_type_id")
    private SportsType sportsType;

    private String address;


    private java.math.BigDecimal price;

    private String description;

    private String status;


    // public String getId() { return id; }
    // public void setId(String id) { this.id = id; }

    // public String getFieldName() { return fieldName; }
    // public void setFieldName(String fieldName) { this.fieldName = fieldName; }

    // public SportsCenter getSportsCenter() { return sportsCenter; }
    // public void setSportsCenter(SportsCenter sportsCenter) { this.sportsCenter = sportsCenter; }

    // public SportsType getSportsType() { return sportsType; }
    // public void setSportsType(SportsType sportsType) { this.sportsType = sportsType; }

    // public String getAddress() { return address; }
    // public void setAddress(String address) { this.address = address; }

    // public java.math.BigDecimal getPrice() { return price; }
    // public void setPrice(java.math.BigDecimal price) { this.price = price; }

    // public String getDescription() { return description; }
    // public void setDescription(String description) { this.description = description; }

    // public String getStatus() { return status; }
    // public void setStatus(String status) { this.status = status; }
}