package com.sportsfacilitybooking.backend.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sportsfacilitybooking.backend.dto.FieldRequest;
import com.sportsfacilitybooking.backend.dto.FieldFullDetailsResponse;
import com.sportsfacilitybooking.backend.dto.FieldResponse;
import com.sportsfacilitybooking.backend.dto.ReviewRequest;
import com.sportsfacilitybooking.backend.dto.ReviewResponse;
import com.sportsfacilitybooking.backend.service.FieldService;
import com.sportsfacilitybooking.backend.service.ReviewService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/fields")
public class FieldController {
    private final FieldService fieldService;
    private final ReviewService reviewService;

    public FieldController(FieldService fieldService, ReviewService reviewService) {
        this.fieldService = fieldService;
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<FieldResponse>> getAllFields() {
        return ResponseEntity.ok(fieldService.getAllFields());
    }

    @GetMapping("/active")
    public ResponseEntity<List<FieldResponse>> getActiveFields() {
        return ResponseEntity.ok(fieldService.getActiveFields());
    }

    @GetMapping("/search")
    public ResponseEntity<Page<FieldResponse>> searchFields(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String sportsType,
        @RequestParam(required = false) String address,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice,
        @RequestParam(required = false) Double minRating,
        @RequestParam(required = false) Double maxRating,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "9") int size,
        @RequestParam(defaultValue = "rating") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return ResponseEntity.ok(
            fieldService.searchFields(
                keyword,
                sportsType,
                address,
                minPrice,
                maxPrice,
                minRating,
                maxRating,
                page,
                size,
                sortBy,
                sortDir
            )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<FieldResponse> getFieldById(@PathVariable String id) {
        return ResponseEntity.ok(fieldService.getFieldById(id));
    }

    @GetMapping("/{id}/full-details")
    public ResponseEntity<FieldFullDetailsResponse> getFieldFullDetails(@PathVariable String id) {
        return ResponseEntity.ok(fieldService.getFieldFullDetails(id));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewResponse>> getReviewsByFieldId(@PathVariable String id) {
        return ResponseEntity.ok(reviewService.getReviewsByFieldId(id));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<ReviewResponse> createReview(
        @PathVariable String id,
        @Valid @RequestBody ReviewRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(id, request, userDetails));
    }

    @PostMapping
    public ResponseEntity<FieldResponse> createField(@Valid @RequestBody FieldRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fieldService.createField(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FieldResponse> updateField(@PathVariable String id, @Valid @RequestBody FieldRequest request) {
        return ResponseEntity.ok(fieldService.updateField(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteField(@PathVariable String id) {
        fieldService.deleteField(id);
        return ResponseEntity.noContent().build();
    }
}
