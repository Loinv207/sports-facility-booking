package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="field_images")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class FieldImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // LIÊN KẾT: Một ảnh phải thuộc về một sân cụ thể
    @ManyToOne
    @JoinColumn(name = "field_id")
    private Field field;

    @Column(name="image_url")
    private String imageUrl;


    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public String getImageUrl(){ return imageUrl; }
    public void setImageUrl(String imageUrl){ this.imageUrl=imageUrl; }
}