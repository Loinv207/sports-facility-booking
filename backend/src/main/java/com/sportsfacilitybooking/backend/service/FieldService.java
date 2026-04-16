package com.sportsfacilitybooking.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.sportsfacilitybooking.backend.dto.FieldRequest;
import com.sportsfacilitybooking.backend.dto.FieldResponse;
import com.sportsfacilitybooking.backend.entity.Field;
import com.sportsfacilitybooking.backend.exception.ResourceNotFoundException;
import com.sportsfacilitybooking.backend.repository.FieldRepository;

@Service
public class FieldService {
    private final FieldRepository fieldRepository;

    public FieldService(FieldRepository fieldRepository) {
        this.fieldRepository = fieldRepository;
    }

    public List<FieldResponse> getAllFields() {
        return fieldRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<FieldResponse> getActiveFields() {
        return fieldRepository.findByStatusIgnoreCase("ACTIVE")
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public FieldResponse getFieldById(String id) {
        Field field = fieldRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân với id: " + id));

        return toResponse(field);
    }

    public FieldResponse createField(FieldRequest request) {
        Field field = new Field();
        field.setId(UUID.randomUUID().toString());
        field.setFieldName(request.fieldName());
        field.setSportsType(request.sportsType());
        field.setAddress(request.address());
        field.setPrice(request.price());
        field.setDescription(request.description());
        field.setStatus(request.status() == null || request.status().isBlank() ? "PENDING" : request.status());

        fieldRepository.save(field);
        return toResponse(field);
    }

    public FieldResponse updateField(String id, FieldRequest request) {
        Field field = fieldRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân với id: " + id));

        field.setFieldName(request.fieldName());
        field.setSportsType(request.sportsType());
        field.setAddress(request.address());
        field.setPrice(request.price());
        field.setDescription(request.description());
        if (request.status() != null && !request.status().isBlank()) {
            field.setStatus(request.status());
        }

        fieldRepository.save(field);
        return toResponse(field);
    }

    public void deleteField(String id) {
        Field field = fieldRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân với id: " + id));

        fieldRepository.delete(field);
    }

    public FieldResponse approveField(String id) {
        Field field = fieldRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sân với ID: " + id));

        field.setStatus("ACTIVE");
        Field updatedField = fieldRepository.save(field);

        return toResponse(updatedField);
    }

    public List<FieldResponse> getPendingFields() {
        return fieldRepository.findByStatus("PENDING").stream()
            .map(this::toResponse)
            .toList();
    }

    private FieldResponse toResponse(Field field) {
        return new FieldResponse(
            field.getId(),
            field.getFieldName(),
            field.getSportsType(),
            field.getAddress(),
            field.getPrice(),
            field.getDescription(),
            field.getStatus()
        );
    }
}
