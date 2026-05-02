package com.sportsfacilitybooking.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportsfacilitybooking.backend.dto.FieldScheduleRequest;
import com.sportsfacilitybooking.backend.dto.FieldScheduleResponse;
import com.sportsfacilitybooking.backend.service.FieldScheduleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/fields/{fieldId}/schedules")
public class FieldScheduleController {
    private final FieldScheduleService fieldScheduleService;

    public FieldScheduleController(FieldScheduleService fieldScheduleService) {
        this.fieldScheduleService = fieldScheduleService;
    }

    @GetMapping
    public ResponseEntity<List<FieldScheduleResponse>> getSchedules(@PathVariable String fieldId) {
        return ResponseEntity.ok(fieldScheduleService.getSchedulesByField(fieldId));
    }

    @PostMapping
    public ResponseEntity<List<FieldScheduleResponse>> createSchedules(
        @PathVariable String fieldId,
        @Valid @RequestBody FieldScheduleRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fieldScheduleService.createSchedules(fieldId, request, userDetails));
    }
}
