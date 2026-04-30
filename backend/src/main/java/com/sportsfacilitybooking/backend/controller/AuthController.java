package com.sportsfacilitybooking.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportsfacilitybooking.backend.dto.AuthResponse;
import com.sportsfacilitybooking.backend.dto.ChangePasswordRequest;
import com.sportsfacilitybooking.backend.dto.LoginRequest;
import com.sportsfacilitybooking.backend.dto.RegisterRequest;
import com.sportsfacilitybooking.backend.dto.UpdateUserProfileRequest;
import com.sportsfacilitybooking.backend.dto.UserProfileResponse;
import com.sportsfacilitybooking.backend.dto.UserResponse;
import com.sportsfacilitybooking.backend.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Auth", description = "Dang ky, dang nhap, thong tin user hien tai")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Dang ky user moi")
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse created = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Dang nhap va nhan JWT")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse auth = authService.login(request);
        return ResponseEntity.ok(auth);
    }

    @Operation(summary = "Lay thong tin profile hien tai")
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> me(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserProfileResponse user = authService.getCurrentProfile(userDetails.getUsername());
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Cap nhat thong tin ca nhan")
    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMe(
        @AuthenticationPrincipal UserDetails userDetails,
        @Valid @RequestBody UpdateUserProfileRequest request
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(authService.updateCurrentProfile(userDetails.getUsername(), request));
    }

    @Operation(summary = "Doi mat khau tai khoan hien tai")
    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
        @AuthenticationPrincipal UserDetails userDetails,
        @Valid @RequestBody ChangePasswordRequest request
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        authService.changeCurrentPassword(userDetails.getUsername(), request);
        return ResponseEntity.noContent().build();
    }
}
