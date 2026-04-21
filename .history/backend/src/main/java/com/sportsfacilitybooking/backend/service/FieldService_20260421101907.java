package com.sportsfacilitybooking.backend.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.sportsfacilitybooking.backend.dto.FieldFullDetailsResponse;
import com.sportsfacilitybooking.backend.dto.FieldImageResponse;
import com.sportsfacilitybooking.backend.dto.FieldRequest;
import com.sportsfacilitybooking.backend.dto.FieldResponse;
import com.sportsfacilitybooking.backend.dto.FieldScheduleResponse;
import com.sportsfacilitybooking.backend.dto.SportsCenterResponse;
import com.sportsfacilitybooking.backend.entity.Field;
import com.sportsfacilitybooking.backend.entity.FieldImage;
import com.sportsfacilitybooking.backend.entity.FieldSchedule;
import com.sportsfacilitybooking.backend.entity.SportsCenter;
import com.sportsfacilitybooking.backend.exception.ResourceNotFoundException;
import com.sportsfacilitybooking.backend.repository.FieldImageRepository;
import com.sportsfacilitybooking.backend.repository.FieldRepository;
import com.sportsfacilitybooking.backend.repository.FieldScheduleRepository;
import com.sportsfacilitybooking.backend.repository.SportsCenterRepository;

@Service
public class FieldService {
    private final FieldRepository fieldRepository;
    private final FieldImageRepository fieldImageRepository;
    private final FieldScheduleRepository fieldScheduleRepository;
    private final SportsCenterRepository sportsCenterRepository;

    public FieldService(
        FieldRepository fieldRepository,
        FieldImageRepository fieldImageRepository,
        FieldScheduleRepository fieldScheduleRepository,
        SportsCenterRepository sportsCenterRepository
    ) {
        this.fieldRepository = fieldRepository;
        this.fieldImageRepository = fieldImageRepository;
        this.fieldScheduleRepository = fieldScheduleRepository;
        this.sportsCenterRepository = sportsCenterRepository;
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

    public Page<FieldResponse> searchFields(
        String keyword,
        String sportsType,
        String address,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        Double minRating,
        Double maxRating,
        int page,
        int size,
        String sortBy,
        String sortDir
    ) {
        Pageable pageable = PageRequest.of(
            Math.max(page, 0),
            Math.min(Math.max(size, 1), 100),
            Sort.by(resolveDirection(sortDir), resolveSortBy(sortBy))
        );

        Specification<Field> specification = buildSearchSpecification(
            keyword,
            sportsType,
            address,
            minPrice,
            maxPrice,
            minRating,
            maxRating
        );

        return fieldRepository.findAll(specification, pageable).map(this::toResponse);
    }

    public FieldResponse getFieldById(String id) {
        Field field = fieldRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay san voi id: " + id));

        return toResponse(field);
    }

    public FieldFullDetailsResponse getFieldFullDetails(String id) {
        Field field = fieldRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay san voi id: " + id));

        List<FieldImageResponse> images = fieldImageRepository.findByFieldIdOrderByIdAsc(id).stream()
            .map(this::toImageResponse)
            .toList();

        List<FieldScheduleResponse> schedules = fieldScheduleRepository.findByFieldIdOrderByScheduleDateAscStartTimeAsc(id).stream()
            .map(this::toScheduleResponse)
            .toList();

        SportsCenterResponse sportsCenter = null;
        if (field.getSportsCenterId() != null && !field.getSportsCenterId().isBlank()) {
            sportsCenter = sportsCenterRepository.findById(field.getSportsCenterId())
                .map(this::toSportsCenterResponse)
                .orElse(null);
        }

        return new FieldFullDetailsResponse(
            field.getId(),
            field.getFieldName(),
            field.getSportsType(),
            field.getAddress(),
            field.getPrice(),
            field.getRating(),
            field.getSportsCenterId(),
            field.getDescription(),
            field.getStatus(),
            images,
            schedules,
            sportsCenter
        );
    }

    public FieldResponse createField(FieldRequest request) {
        Field field = new Field();
        field.setId(UUID.randomUUID().toString());
        field.setFieldName(request.fieldName());
        field.setSportsType(request.sportsType());
        field.setAddress(request.address());
        field.setPrice(request.price());
        field.setRating(request.rating());
        field.setDescription(request.description());
        field.setStatus(request.status() == null || request.status().isBlank() ? "PENDING" : request.status());

        fieldRepository.save(field);
        return toResponse(field);
    }

    public FieldResponse updateField(String id, FieldRequest request) {
        Field field = fieldRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay san voi id: " + id));

        field.setFieldName(request.fieldName());
        field.setSportsType(request.sportsType());
        field.setAddress(request.address());
        field.setPrice(request.price());
        field.setRating(request.rating());
        field.setDescription(request.description());
        if (request.status() != null && !request.status().isBlank()) {
            field.setStatus(request.status());
        }

        fieldRepository.save(field);
        return toResponse(field);
    }

    public void deleteField(String id) {
        Field field = fieldRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay san voi id: " + id));

        fieldRepository.delete(field);
    }

    public FieldResponse approveField(String id) {
        Field field = fieldRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay san voi ID: " + id));

        field.setStatus("ACTIVE");
        Field updatedField = fieldRepository.save(field);

        return toResponse(updatedField);
    }

    public List<FieldResponse> getPendingFields() {
        return fieldRepository.findByStatus("PENDING").stream()
            .map(this::toResponse)
            .toList();
    }

    private Specification<Field> buildSearchSpecification(
        String keyword,
        String sportsType,
        String address,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        Double minRating,
        Double maxRating
    ) {
        return (root, query, criteriaBuilder) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(criteriaBuilder.upper(root.get("status")), "ACTIVE"));

            if (keyword != null && !keyword.isBlank()) {
                String normalizedKeyword = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(
                    criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("fieldName")), normalizedKeyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("sportsType")), normalizedKeyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("address")), normalizedKeyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), normalizedKeyword)
                    )
                );
            }

            if (sportsType != null && !sportsType.isBlank()) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("sportsType")), sportsType.trim().toLowerCase()));
            }

            if (address != null && !address.isBlank()) {
                predicates.add(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("address")), "%" + address.trim().toLowerCase() + "%")
                );
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (minRating != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("rating"), minRating));
            }

            if (maxRating != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("rating"), maxRating));
            }

            return criteriaBuilder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    private Sort.Direction resolveDirection(String sortDir) {
        return "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
    }

    private String resolveSortBy(String sortBy) {
        return switch (sortBy == null ? "" : sortBy) {
            case "fieldName", "price", "rating", "sportsType", "address" -> sortBy;
            default -> "rating";
        };
    }

    private FieldResponse toResponse(Field field) {
        return new FieldResponse(
            field.getId(),
            field.getFieldName(),
            field.getSportsType(),
            field.getAddress(),
            field.getPrice(),
            field.getRating(),
            field.getDescription(),
            field.getStatus()
        );
    }

    private FieldImageResponse toImageResponse(FieldImage fieldImage) {
        return new FieldImageResponse(
            fieldImage.getId(),
            fieldImage.getFieldId(),
            fieldImage.getImageUrl()
        );
    }

    private FieldScheduleResponse toScheduleResponse(FieldSchedule schedule) {
        return new FieldScheduleResponse(
            schedule.getId(),
            schedule.getFieldId(),
            schedule.getScheduleDate(),
            schedule.getStartTime(),
            schedule.getEndTime(),
            schedule.getPrice(),
            schedule.getStatus()
        );
    }

    private SportsCenterResponse toSportsCenterResponse(SportsCenter sportsCenter) {
        return new SportsCenterResponse(
    savedCenter.getId(),
    savedCenter.getName(),
    savedCenter.getAddress(),
    savedCenter.getCity(),
    savedCenter.getApprovalStatus(),
    savedCenter.getCreatedAt(),
    savedCenter.getPhone(),       // Phải thêm vào
    savedCenter.getDescription()  // Phải thêm vào
);
    }
}
