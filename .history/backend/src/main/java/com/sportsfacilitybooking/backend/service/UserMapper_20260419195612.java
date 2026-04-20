package com.sportsfacilitybooking.backend.service;

import com.sportsfacilitybooking.backend.entity.User;
import com.sportsfacilitybooking.backend.dto.UserResponse; 
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.time.ZoneOffset;

@Mapper(componentModel = "spring")
public interface UserMapper {

 
    UserResponse toResponse(User user);
}