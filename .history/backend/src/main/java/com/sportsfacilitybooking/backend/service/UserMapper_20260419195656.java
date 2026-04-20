package com.sportsfacilitybooking.backend.service;

import com.sportsfacilitybooking.backend.entity.User;
import com.sportsfacilitybooking.backend.dto.UserResponse; 
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.time.ZoneOffset;

@Mapper(componentModel = "spring", imports = { ZoneOffset.class })
public interface UserMapper {

    
    @Mapping(target = "fullname", expression = "java(user.getUserProfile() != null ? user.getUserProfile().getFirstName() + \" \" + user.getUserProfile().getLastName() : user.getFullName())")
    @Mapping(target = "createAt", expression = "java(user.getCreatedAt() != null ? user.getCreatedAt().toInstant(ZoneOffset.UTC) : null)")
    @Mapping(target = "updateAt", expression = "java(user.getUpdatedAt() != null ? user.getUpdatedAt().toInstant(ZoneOffset.UTC) : null)")
    UserResponse toResponse(User user);
}