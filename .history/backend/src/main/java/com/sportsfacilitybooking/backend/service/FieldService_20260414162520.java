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

    //Lấy stadiums có status "ACTIVE"
    public List<FieldResponse> getActiveFields() {
    return fieldRepository.findByStatusIgnoreCase("ACTIVE")
        .stream()
        // .map(field -> new FieldResponse(
        //     field.getId(),
        //     field.getFieldName(),
        //     field.getSportsType().getName(),
        //     field.getAddress(),
        //     field.getPrice(),
        //     field.getDescription(),
        //     field.getStatus()
        // ))
        .map(field -> FieldResponse.builder()
    .id(field.getId())
    .fieldName(field.getFieldName())
    .sportsType(field.getSportsType() != null ? field.getSportsType().getName() : "")
    .address(field.getAddress())
    .price(field.getPrice() != null ? field.getPrice().toString() : "0")
    .description(field.getDescription())
    .status(field.getStatus())
    .build())
        .toList();
    }
    // Thay Data để test Postman và UI, sau này sẽ xóa
    // return List.of(
    //     new FieldResponse(
    //         "field-001",
    //         "Sân bóng A",
    //         "Sân cỏ nhân tạo 7 người",
    //         "ACTIVE"
    //     ),
    //     new FieldResponse(
    //         "field-002",
    //         "Sân bóng B",
    //         "Sân tiêu chuẩn FIFA mini",
    //         "ACTIVE"
    //     )
    // );}

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

    // Thêm vào trong FieldService.java
    public FieldResponse approveField(String id) {
    // 1. Tìm sân dựa vào ID
        Field field = fieldRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sân với ID: " + id));

    // 2. Đổi trạng thái từ PENDING sang ACTIVE
        field.setStatus("ACTIVE");

    // 3. Lưu lại vào Database
     Field updatedField = fieldRepository.save(field);

    // 4. Trả về DTO (Dùng hàm map của Lợi đã có sẵn trong Service)
     return toResponse(updatedField);
}

// Hàm lấy các sân đang chờ duyệt (để Lợi hiện lên bảng Admin)
    public List<FieldResponse> getPendingFields() {
        return fieldRepository.findByStatus("PENDING").stream()
                .map(this::toResponse)
                .toList();
}
}
