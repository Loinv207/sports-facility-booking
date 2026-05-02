package com.sportsfacilitybooking.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportsfacilitybooking.backend.dto.FieldImageBulkRequest;
import com.sportsfacilitybooking.backend.dto.FieldImageResponse;
import com.sportsfacilitybooking.backend.dto.FieldScheduleRequest;
import com.sportsfacilitybooking.backend.dto.FieldScheduleResponse;
import com.sportsfacilitybooking.backend.dto.SportsCenterRequest;
import com.sportsfacilitybooking.backend.dto.SportsCenterResponse;
import com.sportsfacilitybooking.backend.service.FieldImageService;
import com.sportsfacilitybooking.backend.service.FieldScheduleService;
import com.sportsfacilitybooking.backend.service.SportsCenterService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/owner")
public class OwnerFieldController {
    private final FieldImageService fieldImageService;
    private final FieldScheduleService fieldScheduleService;
    private final SportsCenterService sportsCenterService;

    public OwnerFieldController(
        FieldImageService fieldImageService,
        FieldScheduleService fieldScheduleService,
        SportsCenterService sportsCenterService
    ) {
        this.fieldImageService = fieldImageService;
        this.fieldScheduleService = fieldScheduleService;
        this.sportsCenterService = sportsCenterService;
    }

    @GetMapping("/fields/{id}/images")
    public ResponseEntity<List<FieldImageResponse>> getFieldImages(@PathVariable("id") String fieldId) {
        return ResponseEntity.ok(fieldImageService.getImagesByField(fieldId));
    }

    @PostMapping("/fields/{id}/images")
    public ResponseEntity<List<FieldImageResponse>> addFieldImages(
        @PathVariable("id") String fieldId,
        @Valid @RequestBody FieldImageBulkRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fieldImageService.addImages(fieldId, request));
    }

    @DeleteMapping("/fields/images/{imageId}")
    public ResponseEntity<Void> deleteFieldImage(@PathVariable String imageId) {
        fieldImageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/fields/{id}/schedules")
    public ResponseEntity<List<FieldScheduleResponse>> getSchedulesByField(@PathVariable("id") String fieldId) {
        return ResponseEntity.ok(fieldScheduleService.getSchedulesByField(fieldId));
    }

    @PostMapping("/fields/{id}/schedules/bulk")
    public ResponseEntity<List<FieldScheduleResponse>> createSchedules(
        @PathVariable("id") String fieldId,
        @Valid @RequestBody FieldScheduleRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fieldScheduleService.createSchedules(fieldId, request, userDetails));
    }

    @PutMapping("/centers/{id}")
    public ResponseEntity<SportsCenterResponse> updateSportsCenter(
        @PathVariable("id") String centerId,
        @RequestBody SportsCenterRequest request
    ) {
        return ResponseEntity.ok(sportsCenterService.updateSportsCenter(centerId, request));
    }
}
