package com.sportsfacilitybooking.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.sportsfacilitybooking.backend.dto.FieldImageBulkRequest;
import com.sportsfacilitybooking.backend.dto.FieldImageResponse;
import com.sportsfacilitybooking.backend.entity.FieldImage;
import com.sportsfacilitybooking.backend.exception.ResourceNotFoundException;
import com.sportsfacilitybooking.backend.repository.FieldImageRepository;
import com.sportsfacilitybooking.backend.repository.FieldRepository;

@Service
public class FieldImageService {
    private final FieldRepository fieldRepository;
    private final FieldImageRepository fieldImageRepository;

    public FieldImageService(FieldRepository fieldRepository, FieldImageRepository fieldImageRepository) {
        this.fieldRepository = fieldRepository;
        this.fieldImageRepository = fieldImageRepository;
    }

    public List<FieldImageResponse> getImagesByField(String fieldId) {
        validateField(fieldId);
        return fieldImageRepository.findByFieldId(fieldId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public List<FieldImageResponse> addImages(String fieldId, FieldImageBulkRequest request) {
        validateField(fieldId);

        List<FieldImage> images = request.imageUrls().stream()
            .filter(url -> url != null && !url.isBlank())
            .map(url -> createFieldImage(fieldId, url.trim()))
            .toList();

        return fieldImageRepository.saveAll(images)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public void deleteImage(String imageId) {
        FieldImage image = fieldImageRepository.findById(imageId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ảnh sân với id: " + imageId));

        fieldImageRepository.delete(image);
    }

    private void validateField(String fieldId) {
        if (!fieldRepository.existsById(fieldId)) {
            throw new ResourceNotFoundException("Không tìm thấy sân với id: " + fieldId);
        }
    }

    private FieldImage createFieldImage(String fieldId, String imageUrl) {
        FieldImage image = new FieldImage();
        image.setId(UUID.randomUUID().toString());
        image.setFieldId(fieldId);
        image.setImageUrl(imageUrl);
        return image;
    }

    private FieldImageResponse toResponse(FieldImage image) {
        return new FieldImageResponse(image.getId(), image.getFieldId(), image.getImageUrl());
    }
}
