package com.sportsfacilitybooking.backend.controller;

import com.sportsfacilitybooking.backend.entity.Commission;
import com.sportsfacilitybooking.backend.service.CommissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin/config/commission")
public class CommissionController {

    @Autowired
    private CommissionService commissionService;

    @GetMapping
    public ResponseEntity<Commission> getCommission() {
        return ResponseEntity.ok(commissionService.getSystemCommission());
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')") 
    public ResponseEntity<Commission> updateCommission(@RequestBody BigDecimal rate, Authentication authentication) {
        String adminUsername = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(commissionService.updateCommissionRate(rate, adminUsername));
    }
}
