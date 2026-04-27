package com.sportsfacilitybooking.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sportsfacilitybooking.backend.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findAllByOrderByCreatedAtDesc();
    List<Booking> findByStatusIgnoreCaseOrderByCreatedAtDesc(String status);

    @Query("""
        select b from Booking b
        where b.fieldId in :fieldIds
        order by b.createdAt desc
    """)
    List<Booking> findByFieldIdInOrderByCreatedAtDesc(@Param("fieldIds") List<String> fieldIds);
}
