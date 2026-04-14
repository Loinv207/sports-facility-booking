package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="reviews")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // LIÊN KẾT: Một người dùng có thể viết nhiều đánh giá
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // LIÊN KẾT: Một sân có thể nhận nhiều đánh giá
    @ManyToOne
    @JoinColumn(name = "field_id")
    private Field field;

    private Integer rating;
    private String comment;

    @Column(name="created_at")
    private LocalDateTime createdAt;


}