package com.sportsfacilitybooking.backend.repository;

import com.sportsfacilitybooking.backend.entity.SportsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SportsTypeRepository extends JpaRepository<SportsType, Integer> {
    // Thêm hàm này để tìm môn thể thao theo tên (ví dụ: "Bóng đá")
    Optional<SportsType> findByName(String name);
}