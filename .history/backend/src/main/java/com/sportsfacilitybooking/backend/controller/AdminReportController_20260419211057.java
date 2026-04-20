package com.sportsfacilitybooking.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("path", method=RequestMethod.GET)
public String requestMethodName(@RequestParam String param) {
    return new String();
}
("/api/admin/reports")
public class AdminReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/system")
    public ResponseEntity<SystemSummaryResponse> getSummary() {
        return ResponseEntity.ok(reportService.getSystemSummary());
    }
}
