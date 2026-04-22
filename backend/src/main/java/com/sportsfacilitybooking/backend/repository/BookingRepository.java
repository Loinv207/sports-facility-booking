package com.sportsfacilitybooking.backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsfacilitybooking.backend.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, String> {
    boolean existsByFieldScheduleIdAndStatusIn(String fieldScheduleId, Collection<String> statuses);
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    java.util.Optional<Booking> findByIdAndUserId(String id, Long userId);
    boolean existsByUserIdAndFieldIdAndStatus(Long userId, String fieldId, String status);
}
