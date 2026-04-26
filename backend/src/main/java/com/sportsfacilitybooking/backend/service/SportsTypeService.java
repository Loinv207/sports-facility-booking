package com.sportsfacilitybooking.backend.service;

import com.sportsfacilitybooking.backend.entity.SportsType;
import com.sportsfacilitybooking.backend.repository.SportsTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SportsTypeService {

    @Autowired
    private SportsTypeRepository sportsTypeRepository;

    public List<SportsType> getAllSportsTypes() {
        return sportsTypeRepository.findAll();
    }

    public SportsType saveSportsType(SportsType sportsType) {
        return sportsTypeRepository.save(sportsType);
    }

    public void deleteSportsType(Integer id) {
        sportsTypeRepository.deleteById(id);
    }
    
    public SportsType updateSportsType(Integer id, SportsType updatedType) {
        return sportsTypeRepository.findById(id).map(type -> {
            type.setName(updatedType.getName());
            type.setDescription(updatedType.getDescription());
            return sportsTypeRepository.save(type);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy loại sân"));
    }
}