package com.sportsfacilitybooking.backend.service;

import org.springframework.stereotype.Service;

import com.sportsfacilitybooking.backend.dto.SportsCenterRequest;
import com.sportsfacilitybooking.backend.dto.SportsCenterResponse;
import com.sportsfacilitybooking.backend.entity.SportsCenter;
import com.sportsfacilitybooking.backend.repository.SportsCenterRepository;

@Service
public class SportsCenterService {
    private final SportsCenterRepository sportsCenterRepository;

    public SportsCenterService(SportsCenterRepository sportsCenterRepository) {
        this.sportsCenterRepository = sportsCenterRepository;
    }

    public SportsCenterResponse updateSportsCenter(String centerId, SportsCenterRequest request) {
        SportsCenter center = sportsCenterRepository.findById(centerId)
            .orElseGet(() -> {
                SportsCenter sportsCenter = new SportsCenter();
                sportsCenter.setId(centerId);
                return sportsCenter;
            });

        center.setName(request.name());
        center.setAddress(request.address());
        center.setCity(request.city());
        center.setPhone(request.phone());
        center.setDescription(request.description());
        center.setApprovalStatus(request.approvalStatus());

        SportsCenter savedCenter = sportsCenterRepository.save(center);
        return new SportsCenterResponse(
            savedCenter.getId(),
            savedCenter.getName(),
            savedCenter.getAddress(),
            savedCenter.getCity(),
            savedCenter.getPhone(),
            savedCenter.getDescription(),
            savedCenter.getApprovalStatus()
        );
    }
}
