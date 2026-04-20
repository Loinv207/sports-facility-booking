package com.sportsfacilitybooking.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.sportsfacilitybooking.backend.entity.Field;

public interface FieldRepository extends JpaRepository<Field, String>, JpaSpecificationExecutor<Field> {
    List<Field> findByStatusIgnoreCase(String status);
    List<Field> findByStatus(String status);
    boolean existsByFieldNameIgnoreCase(String fieldName);
    Optional<Field> findByFieldNameIgnoreCase(String fieldName);
}
