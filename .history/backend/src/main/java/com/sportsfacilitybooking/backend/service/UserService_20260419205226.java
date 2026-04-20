package com.sportsfacilitybooking.backend.service;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportsfacilitybooking.backend.dto.UserResponse;
import com.sportsfacilitybooking.backend.entity.Role;
import com.sportsfacilitybooking.backend.entity.User;
import com.sportsfacilitybooking.backend.exception.ResourceNotFoundException;
import com.sportsfacilitybooking.backend.repository.UserRepository;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> findAll(String search, Role role, Pageable pageable) {
        Page<User> users = userRepository.findAllBySearchAndRole(search, role, pageable);

        return users.map(userMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User" + id));

        return userMapper.toResponse(user);
    }
    //  create
    //  update
    // delete...


    @Transactional
public UserResponse toggleUserStatus(Long id) {
    // 1. Tìm user theo ID
    User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng có ID: " + id));

    // 2. Logic đảo trạng thái
    // Nếu status đang là ACTIVE (hoặc null) thì chuyển thành LOCKED và ngược lại
    if ("ACTIVE".equalsIgnoreCase(user.getStatus())) {
        user.setStatus("LOCKED");
    } else {
        user.setStatus("ACTIVE");
    }

    user.setUpdatedAt(LocalDateTime.now());

  
    User updatedUser = userRepository.save(user);

    return userMapper.toResponse(updatedUser);
}
}
