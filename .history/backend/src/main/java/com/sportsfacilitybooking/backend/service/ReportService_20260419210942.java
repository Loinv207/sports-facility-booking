package com.sportsfacilitybooking.backend.service;

import org.springframework.stereotype.Service;

@Service
public class ReportService {
    @Autowired
    private SystemReportRepository reportRepository;

    public SystemSummaryResponse getSystemSummary() {
        Double revenue = reportRepository.sumAllRevenue();
        Long bookings = reportRepository.sumAllBookings();
        
        return new SystemSummaryResponse(
            revenue != null ? revenue : 0.0, 
            bookings != null ? bookings : 0L
        );
    }
}
