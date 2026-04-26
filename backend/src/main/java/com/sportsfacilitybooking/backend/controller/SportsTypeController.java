package com.sportsfacilitybooking.backend.controller;

import com.sportsfacilitybooking.backend.entity.SportsType;
import com.sportsfacilitybooking.backend.service.SportsTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class SportsTypeController {

    @Autowired
    private SportsTypeService sportsTypeService;

    @GetMapping
    public List<SportsType> list() {
        return sportsTypeService.getAllSportsTypes();
    }

    @PostMapping
    public SportsType create(@RequestBody SportsType sportsType) {
        return sportsTypeService.saveSportsType(sportsType);
    }

    @PutMapping("/{id}")
    public SportsType update(@PathVariable Integer id, @RequestBody SportsType sportsType) {
        return sportsTypeService.updateSportsType(id, sportsType);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        sportsTypeService.deleteSportsType(id);
    }
}