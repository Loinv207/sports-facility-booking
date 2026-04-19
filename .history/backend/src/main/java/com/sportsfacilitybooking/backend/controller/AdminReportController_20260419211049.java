package com.sportsfacilitybooking.backend.controller;

@RestController
@RequestMapping("/api/admin/reports")
public class AdminReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/system")
    public ResponseEntity<SystemSummaryResponse> getSummary() {
        return ResponseEntity.ok(reportService.getSystemSummary());
    }
}
