package com.sportsfacilitybooking.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsfacilitybooking.backend.entity.Field;

public interface FieldRepository extends JpaRepository<Field, String> {
}
