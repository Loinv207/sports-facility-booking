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
        return fieldRepository.findAll().stream().map(field ->
            new FieldResponse(
                field.getId(),
                field.getFieldName(),
                field.getDescription(),
                field.getStatus()
            )
        ).toList();
    }

    public FieldResponse getFieldById(String id) {
        Field field = fieldRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân với id: " + id));

        return new FieldResponse(field.getId(), field.getFieldName(), field.getDescription(), field.getStatus());
    }

    public FieldResponse createField(FieldRequest request) {
        Field field = new Field();
        field.setId(UUID.randomUUID().toString());
        field.setFieldName(request.fieldName());
        field.setDescription(request.description());
        field.setStatus(request.status());

        fieldRepository.save(field);
        return new FieldResponse(field.getId(), field.getFieldName(), field.getDescription(), field.getStatus());
    }

    public FieldResponse updateField(String id, FieldRequest request) {
        Field field = fieldRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân với id: " + id));

        field.setFieldName(request.fieldName());
        field.setDescription(request.description());
        field.setStatus(request.status());

        fieldRepository.save(field);
        return new FieldResponse(field.getId(), field.getFieldName(), field.getDescription(), field.getStatus());
    }

    public void deleteField(String id) {
        Field field = fieldRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân với id: " + id));

        fieldRepository.delete(field);
    }
}
