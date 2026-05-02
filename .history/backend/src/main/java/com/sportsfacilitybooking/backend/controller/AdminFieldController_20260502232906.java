package com.sportsfacilitybooking.backend.controller;

import com.sportsfacilitybooking.backend.dto.FieldResponse;
import com.sportsfacilitybooking.backend.service.FieldService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/fields") 
public class AdminFieldController {

    private final FieldService fieldService;

    public AdminFieldController(FieldService fieldService) {
        this.fieldService = fieldService;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<FieldResponse>> getPendingFields() {
        return ResponseEntity.ok(fieldService.getPendingFields());
    }

    
    @PutMapping("/{id}/approve")
    public ResponseEntity<FieldResponse> approveField(@PathVariable String id) {
        return ResponseEntity.ok(fieldService.approveField(id));
    }
}