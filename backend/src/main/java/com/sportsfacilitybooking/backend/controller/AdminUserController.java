package com.sportsfacilitybooking.backend.controller;

import com.sportsfacilitybooking.backend.dto.UserResponse;
import com.sportsfacilitybooking.backend.entity.Role;
import com.sportsfacilitybooking.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role,
            @PageableDefault(size = 10) Pageable pageable) {
            
        
        return ResponseEntity.ok(userService.findAll(search, role, pageable));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<UserResponse> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserStatus(id));
}
}