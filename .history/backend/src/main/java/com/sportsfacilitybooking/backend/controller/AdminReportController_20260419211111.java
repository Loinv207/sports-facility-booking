package com.sportsfacilitybooking.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportsfacilitybooking.backend.service.ReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/admin/reports")
public class AdminReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("path")
    public String getMethodName(@RequestParam String param) {
        return new String();
    }
    ("/system")
    public ResponseEntity<SystemSummaryResponse> getSummary() {
        return ResponseEntity.ok(reportService.getSystemSummary());
    }
}
