package com.sportsfacilitybooking.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsfacilitybooking.backend.entity.SportsCenter;

public interface SportsCenterRepository extends JpaRepository<SportsCenter, String> {
}
