package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="reviews")
public class Review {

    @Id
    private String id;

    @Column(name = "field_id", nullable = false)
    private String fieldId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private Integer rating;
    private String comment;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    public Review(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public String getFieldId() { return fieldId; }
    public void setFieldId(String fieldId) { this.fieldId = fieldId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getRating(){ return rating; }
    public void setRating(Integer rating){ this.rating=rating; }

    public String getComment(){ return comment; }
    public void setComment(String comment){ this.comment=comment; }

    public LocalDateTime getCreatedAt(){ return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt=createdAt; }
}
