package com.sportsfacilitybooking.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.sportsfacilitybooking.backend.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByFieldIdOrderByCreatedAtDesc(String fieldId);

    boolean existsByFieldIdAndUserId(String fieldId, Long userId);

    @Query("select avg(r.rating) from Review r where r.fieldId = :fieldId")
    Optional<Double> findAverageRatingByFieldId(String fieldId);
}
