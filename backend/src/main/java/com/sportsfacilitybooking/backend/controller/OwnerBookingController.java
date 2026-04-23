package com.sportsfacilitybooking.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportsfacilitybooking.backend.dto.OwnerBookingResponse;
import com.sportsfacilitybooking.backend.dto.OwnerBookingStatusRequest;
import com.sportsfacilitybooking.backend.dto.OwnerCheckInRequest;
import com.sportsfacilitybooking.backend.dto.OwnerRevenueReportResponse;
import com.sportsfacilitybooking.backend.service.OwnerBookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/owner")
public class OwnerBookingController {
    private final OwnerBookingService ownerBookingService;

    public OwnerBookingController(OwnerBookingService ownerBookingService) {
        this.ownerBookingService = ownerBookingService;
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<OwnerBookingResponse>> getOwnerBookings() {
        return ResponseEntity.ok(ownerBookingService.getOwnerBookings());
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<OwnerBookingResponse> updateBookingStatus(
        @PathVariable String id,
        @Valid @RequestBody OwnerBookingStatusRequest request
    ) {
        return ResponseEntity.ok(ownerBookingService.updateBookingStatus(id, request));
    }

    @PostMapping("/check-in")
    public ResponseEntity<OwnerBookingResponse> checkIn(@Valid @RequestBody OwnerCheckInRequest request) {
        return ResponseEntity.ok(ownerBookingService.checkIn(request));
    }

    @GetMapping("/reports/revenue")
    public ResponseEntity<OwnerRevenueReportResponse> getRevenueReport() {
        return ResponseEntity.ok(ownerBookingService.getRevenueReport());
    }
}
