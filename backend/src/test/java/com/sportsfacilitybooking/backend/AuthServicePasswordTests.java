package com.sportsfacilitybooking.backend;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;

import com.sportsfacilitybooking.backend.dto.ChangePasswordRequest;
import com.sportsfacilitybooking.backend.dto.LoginRequest;
import com.sportsfacilitybooking.backend.dto.RegisterRequest;
import com.sportsfacilitybooking.backend.entity.Role;
import com.sportsfacilitybooking.backend.service.AuthService;

@SpringBootTest
@ActiveProfiles("test")
class AuthServicePasswordTests {

    @Autowired
    private AuthService authService;

    @Test
    void changePasswordRejectsOldPasswordAndAllowsNewPassword() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String username = "profile_" + suffix;
        String email = "profile_" + suffix + "@example.com";

        authService.register(new RegisterRequest(
            username,
            email,
            "password123",
            Role.USER,
            "Profile User",
            "0900000000"
        ));

        authService.changeCurrentPassword(username, new ChangePasswordRequest(
            "password123",
            "newpass123",
            "newpass123"
        ));

        assertThatThrownBy(() -> authService.login(new LoginRequest(username, "password123")))
            .isInstanceOf(BadCredentialsException.class);

        assertThat(authService.login(new LoginRequest(username, "newpass123")).accessToken())
            .isNotBlank();
    }
}
