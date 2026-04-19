package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name="field_images")
public class FieldImage {

    @Id
    private String id;

    @Column(name="field_id")
    private String fieldId;

    @Column(name="image_url")
    private String imageUrl;

    public FieldImage(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public String getFieldId(){ return fieldId; }
    public void setFieldId(String fieldId){ this.fieldId=fieldId; }

    public String getImageUrl(){ return imageUrl; }
    public void setImageUrl(String imageUrl){ this.imageUrl=imageUrl; }
}
