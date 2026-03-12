package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "fields")
public class Field {

    @Id
    private String id;

    @Column(name = "field_name")
    private String fieldName;

    private String description;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}