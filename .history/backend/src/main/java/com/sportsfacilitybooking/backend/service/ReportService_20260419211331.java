package com.sportsfacilitybooking.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sportsfacilitybooking.backend.dto.SystemSummary;
import com.sportsfacilitybooking.backend.repository.SystemReportRepository;

@Service
public class ReportService {
    @Autowired
    private SystemReportRepository reportRepository;

    public SystemSummaryRespo getSystemSummary() {
        Double revenue = reportRepository.sumAllRevenue();
        Long bookings = reportRepository.sumAllBookings();
        
        return new SystemSummary(
            revenue != null ? revenue : 0.0, 
            bookings != null ? bookings : 0L
        );
    }
}
