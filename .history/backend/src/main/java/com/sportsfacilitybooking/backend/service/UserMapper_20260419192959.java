package com.sportsfacilitybooking.backend.service;

import com.sportsfacilitybooking.backend.entity.User;
import com.sportsfacilitybooking.backend.dto.UserResponse; 
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "fullname", source = "fullName")
    @Mapping(target = "createAt", source = "createdAt")
    @Mapping(target = "updateAt", source = "createdAt") 
    UserResponse toResponse(User user);
}