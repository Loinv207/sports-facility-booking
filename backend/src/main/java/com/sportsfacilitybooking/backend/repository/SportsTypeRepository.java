package com.sportsfacilitybooking.backend.repository;

import com.sportsfacilitybooking.backend.entity.SportsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SportsTypeRepository extends JpaRepository<SportsType, Integer> {
    Optional<SportsType> findByNameIgnoreCase(String name);
}
