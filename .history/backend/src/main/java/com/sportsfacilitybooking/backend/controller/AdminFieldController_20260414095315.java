package com.sportsfacilitybooking.backend.controller;

import com.sportsfacilitybooking.backend.dto.FieldResponse;
import com.sportsfacilitybooking.backend.service.FieldService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/fields") // Tiền tố admin riêng biệt
public class AdminFieldController {

    private final FieldService fieldService;

    public AdminFieldController(FieldService fieldService) {
        this.fieldService = fieldService;
    }

    // 1. API lấy danh sách các sân đang chờ duyệt (PENDING) để Lợi thấy mà duyệt
    @GetMapping("/pending")
    public ResponseEntity<List<FieldResponse>> getPendingFields() {
        return ResponseEntity.ok(fieldService.getPendingFields());
    }

    // 2. Nhiệm vụ chính của Lợi: API duyệt sân sang ACTIVE
    @PutMapping("/{id}/approve")
    public ResponseEntity<FieldResponse> approveField(@PathVariable String id) {
        return ResponseEntity.ok(fieldService.approveField(id));
    }
}