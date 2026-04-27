package com.sportsfacilitybooking.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsfacilitybooking.backend.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findAllByOrderByCreatedAtDesc();
    List<Booking> findByStatusIgnoreCaseOrderByCreatedAtDesc(String status);
}
