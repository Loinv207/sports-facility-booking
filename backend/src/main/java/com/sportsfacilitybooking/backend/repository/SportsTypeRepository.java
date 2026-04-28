package com.sportsfacilitybooking.backend.repository;

import com.sportsfacilitybooking.backend.entity.SportsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SportsTypeRepository extends JpaRepository<SportsType, Integer> {
    
}