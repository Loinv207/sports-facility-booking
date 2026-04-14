package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="reviews")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {

    @Id
    private String id;

    private Integer rating;
    private String comment;

    @Column(name="created_at")
    private LocalDateTime createdAt;



    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public Integer getRating(){ return rating; }
    public void setRating(Integer rating){ this.rating=rating; }

    public String getComment(){ return comment; }
    public void setComment(String comment){ this.comment=comment; }

    public LocalDateTime getCreatedAt(){ return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt=createdAt; }
}