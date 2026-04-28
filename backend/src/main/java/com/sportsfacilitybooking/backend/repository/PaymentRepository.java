package com.sportsfacilitybooking.backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsfacilitybooking.backend.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByBookingIdIn(Collection<String> bookingIds);
    java.util.Optional<Payment> findByBookingId(String bookingId);
}
