package com.sportsfacilitybooking.backend.service;

import com.sportsfacilitybooking.backend.entity.User;
import com.sportsfacilitybooking.backend.dto.UserResponse; 
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "fullname", source = "fullName")
    @Mapping(target = "createAt", source = "createdAt")
    
    // 3. Nếu DTO có updateAt mà Entity User không có, hãy tạm thời bỏ qua hoặc map từ createdAt
    @Mapping(target = "updateAt", source = "createdAt")
    UserResponse toResponse(User user);
}