package com.sportsfacilitybooking.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportsfacilitybooking.backend.service.ReportService;

@RestController
@RequestMapping("/api/admin/reports")
public class AdminReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/system")
    public ResponseEntity<SystemSummary> getSummary() {
        return ResponseEntity.ok(reportService.getSystemSummary());
    }
}
