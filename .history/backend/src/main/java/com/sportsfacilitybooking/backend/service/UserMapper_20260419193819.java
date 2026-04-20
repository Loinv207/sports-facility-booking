package com.sportsfacilitybooking.backend.service;

import com.sportsfacilitybooking.backend.entity.User;
import com.sportsfacilitybooking.backend.dto.UserResponse; 
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", imports = { java.time.ZoneOffset })
public interface UserMapper {


    UserResponse toResponse(User user);
}