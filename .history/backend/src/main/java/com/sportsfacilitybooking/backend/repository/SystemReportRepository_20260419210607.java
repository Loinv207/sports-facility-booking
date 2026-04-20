package com.sportsfacilitybooking.backend.repository;

import org.springframework.stereotype.Repository;

@Repository
public interface SystemReportRepository extends JpaRepository<SystemReport, String> {
    
    // Tính tổng doanh thu
    @Query("SELECT SUM(r.totalRevenue) FROM SystemReport r")
    Double sumAllRevenue();

    // Tính tổng số lượng booking
    @Query("SELECT SUM(r.totalBookings) FROM SystemReport r")
    Long sumAllBookings();
}
