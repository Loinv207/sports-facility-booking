package com.sportsfacilitybooking.backend.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sportsfacilitybooking.backend.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, String> {
    boolean existsByFieldScheduleIdAndStatusIn(String fieldScheduleId, Collection<String> statuses);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Booking> findByIdAndUserId(String id, Long userId);

    boolean existsByUserIdAndFieldIdAndStatus(Long userId, String fieldId, String status);

    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findByStatusIgnoreCaseOrderByCreatedAtDesc(String status);

    @Query("""
        select b from Booking b
        where b.fieldId in :fieldIds
        order by b.createdAt desc
    """)
    List<Booking> findByFieldIdInOrderByCreatedAtDesc(@Param("fieldIds") List<String> fieldIds);

    List<Booking> findByStatusIn(List<String> statuses);


    // BookingRepository.java
    @Query("SELECT MONTH(b.bookingDate) as month, SUM(b.totalPrice) as revenue, COUNT(b.id) as count " +
        "FROM Booking b WHERE b.status IN ('PAID', 'COMPLETED') AND YEAR(b.bookingDate) = YEAR(CURRENT_DATE) " +
        "GROUP BY MONTH(b.bookingDate) ORDER BY MONTH(b.bookingDate)")
    List<Object[]> getMonthlyRevenueReport();
}
