package com.sportsfacilitybooking.backend.repository;

import com.sportsfacilitybooking.backend.entity.Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, String> {
    
}