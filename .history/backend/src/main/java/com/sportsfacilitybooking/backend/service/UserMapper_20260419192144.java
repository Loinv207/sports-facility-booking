package com.sportsfacilitybooking.backend.service;

import com.sportsfacilitybooking.backend.entity.User;
import com.sportsfacilitybooking.backend.dto.UserResponse; 
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "fullname", source = "userProfile.fullName")
    @Mapping(target = "createAt", source = "createdAt") // Khớp tên field Entity (thường là createdAt) với DTO
    @Mapping(target = "updateAt", source = "updatedAt")
    UserResponse toResponse(User user);
}