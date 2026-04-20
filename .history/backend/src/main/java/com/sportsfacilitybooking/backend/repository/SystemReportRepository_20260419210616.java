package com.sportsfacilitybooking.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sportsfacilitybooking.backend.entity.SystemReport;

@Repository
public interface SystemReportRepository extends JpaRepository<SystemReport, String> {
    
    // Tính tổng doanh thu
    @Query("SELECT SUM(r.totalRevenue) FROM SystemReport r")
    Double sumAllRevenue();

    // Tính tổng số lượng booking
    @Query("SELECT SUM(r.totalBookings) FROM SystemReport r")
    Long sumAllBookings();
}
