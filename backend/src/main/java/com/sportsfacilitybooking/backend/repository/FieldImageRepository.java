package com.sportsfacilitybooking.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsfacilitybooking.backend.entity.FieldImage;

public interface FieldImageRepository extends JpaRepository<FieldImage, String> {
    List<FieldImage> findByFieldIdOrderByIdAsc(String fieldId);
    boolean existsByFieldIdAndImageUrl(String fieldId, String imageUrl);
    List<FieldImage> findByFieldId(String fieldId);
}
