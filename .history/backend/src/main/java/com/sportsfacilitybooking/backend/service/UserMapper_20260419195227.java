package com.sportsfacilitybooking.backend.service;

import com.sportsfacilitybooking.backend.entity.User;
import com.sportsfacilitybooking.backend.dto.UserResponse; 
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
@Transactional(readOnly = true)
public Page<UserResponse> findAll(String search, Role role, Pageable pageable) {
    Page<User> users = userRepository.findAllBySearchAndRole(search, role, pageable);

    return users.map(user -> new UserResponse(
        user.getId(),
        user.getUsername(),
        user.getEmail(),
        user.getRole(),
        // Lấy từ UserProfile đã link
        user.getUserProfile() != null ? 
            (user.getUserProfile().getFirstName() + " " + user.getUserProfile().getLastName()) : "Chưa cập nhật",
        user.getCreatedAt() != null ? user.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant() : null,
        user.getUpdatedAt() != null ? user.getUpdatedAt().atZone(ZoneId.systemDefault()).toInstant() : null
    ));
}