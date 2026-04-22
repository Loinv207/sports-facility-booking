package com.sportsfacilitybooking.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsfacilitybooking.backend.entity.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
}
