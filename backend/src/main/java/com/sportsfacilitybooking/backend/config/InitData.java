package com.sportsfacilitybooking.backend.config;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.sportsfacilitybooking.backend.entity.Role;
import com.sportsfacilitybooking.backend.entity.User;
import com.sportsfacilitybooking.backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class InitData implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(InitData.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.init.admin.username:admin}")
    private String adminUsername;

    @Value("${app.init.admin.email:admin@sportsbooking.local}")
    private String adminEmail;

    @Value("${app.init.admin.password:Admin@123}")
    private String adminPassword;

    @Value("${app.init.admin.full-name:System Admin}")
    private String adminFullName;

    public InitData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        boolean exists = userRepository.existsByUsername(adminUsername) || userRepository.existsByEmail(adminEmail);
        if (exists) {
            log.info("InitData: Admin account already exists, skip seeding.");
            return;
        }

        User adminUser = User.builder()
            .username(adminUsername)
            .email(adminEmail)
            .passwordHash(passwordEncoder.encode(adminPassword))
            .fullName(adminFullName)
            .role(Role.ADMIN)
            .status("ACTIVE")
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        userRepository.save(adminUser);
        log.info("InitData: Seeded default admin account with username '{}'.", adminUsername);
    }
}
