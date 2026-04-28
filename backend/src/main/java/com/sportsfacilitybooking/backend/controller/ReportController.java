package com.sportsfacilitybooking.backend.controller;

import com.sportsfacilitybooking.backend.dto.FinanceReportResponse;
import com.sportsfacilitybooking.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/finance")
    @PreAuthorize("hasRole('ADMIN')") 
    public ResponseEntity<FinanceReportResponse> getFinanceReport() {
        return ResponseEntity.ok(reportService.getFinanceReport());
    }
}