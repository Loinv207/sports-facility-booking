package com.sportsfacilitybooking.backend.service;

import com.sportsfacilitybooking.backend.entity.User;
import com.sportsfacilitybooking.backend.dto.UserResponse; 
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "fullname", expression = "java(user.getUserProfile() != null ? user.getUserProfile().getFirstName() + \" \" + user.getUserProfile().getLastName() : null)")
    @Mapping(target = "createAt", source = "createdAt")
    @Mapping(target = "updateAt", source = "updatedAt")
    UserResponse toResponse(User user);
}