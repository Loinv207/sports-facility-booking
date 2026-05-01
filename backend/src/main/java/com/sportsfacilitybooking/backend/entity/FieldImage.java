package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "field_images")
public class FieldImage {

    @Id
    private String id;

    @Column(name = "field_id", nullable = false)
    private String fieldId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", insertable = false, updatable = false)
    private Field field;

    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;

    public FieldImage() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFieldId() {
        return fieldId;
    }

    public void setFieldId(String fieldId) {
        this.fieldId = fieldId;
    }

    public Field getField() {
        return field;
    }

    public void setField(Field field) {
        this.field = field;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
