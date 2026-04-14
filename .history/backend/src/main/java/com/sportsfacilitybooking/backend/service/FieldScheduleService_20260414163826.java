package com.sportsfacilitybooking.backend.service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.sportsfacilitybooking.backend.dto.FieldScheduleRequest;
import com.sportsfacilitybooking.backend.dto.FieldScheduleResponse;
import com.sportsfacilitybooking.backend.entity.FieldSchedule;
import com.sportsfacilitybooking.backend.exception.BusinessException;
import com.sportsfacilitybooking.backend.exception.ResourceNotFoundException;
import com.sportsfacilitybooking.backend.repository.FieldRepository;
import com.sportsfacilitybooking.backend.repository.FieldScheduleRepository;

@Service
public class FieldScheduleService {
    private final FieldScheduleRepository fieldScheduleRepository;
    private final FieldRepository fieldRepository;

    public FieldScheduleService(FieldScheduleRepository fieldScheduleRepository, FieldRepository fieldRepository) {
        this.fieldScheduleRepository = fieldScheduleRepository;
        this.fieldRepository = fieldRepository;
    }

    public List<FieldScheduleResponse> getSchedulesByField(String fieldId) {
        if (!fieldRepository.existsById(fieldId)) {
            throw new ResourceNotFoundException("Không tìm thấy sân với id: " + fieldId);
        }

        return fieldScheduleRepository.findByFieldIdOrderByScheduleDateAscStartTimeAsc(fieldId)
            .stream()
            .map(item -> new FieldScheduleResponse(
                item.getId(),
                item.getFieldId(),
                item.getScheduleDate(),
                item.getStartTime(),
                item.getEndTime(),
                item.getPrice(),
                item.getStatus()
            ))
            .toList();
    }

    public List<FieldScheduleResponse> createSchedules(String fieldId, FieldScheduleRequest request) {
        if (!fieldRepository.existsById(fieldId)) {
            throw new ResourceNotFoundException("Không tìm thấy sân với id: " + fieldId);
        }

        if (request.slotMinutes() == null || request.slotMinutes() <= 0) {
            throw new BusinessException("slotMinutes phải lớn hơn 0");
        }

        if (!request.startTime().isBefore(request.endTime())) {
            throw new BusinessException("Giờ bắt đầu phải nhỏ hơn giờ kết thúc");
        }

        List<FieldScheduleResponse> result = new ArrayList<>();
        LocalTime currentStart = request.startTime();

        while (currentStart.isBefore(request.endTime())) {
            LocalTime currentEnd = currentStart.plusMinutes(request.slotMinutes());

            if (currentEnd.isAfter(request.endTime())) {
                break;
            }

            boolean duplicated = fieldScheduleRepository
                .existsByFieldIdAndScheduleDateAndStartTimeLessThanAndEndTimeGreaterThan(
                    fieldId,
                    request.scheduleDate(),
                    currentEnd,
                    currentStart
                );

            if (duplicated) {
                throw new BusinessException("Khung giờ bị trùng: " + currentStart + " - " + currentEnd);
            }

            FieldSchedule schedule = new FieldSchedule();
            schedule.setId(UUID.randomUUID().toString());
            schedule.setFieldId(fieldId);
            schedule.setScheduleDate(request.scheduleDate());
            schedule.setStartTime(currentStart);
            schedule.setEndTime(currentEnd);
            schedule.setPrice(request.price());
            schedule.setStatus("AVAILABLE");

            fieldScheduleRepository.save(schedule);

            result.add(new FieldScheduleResponse(
                schedule.getId(),
                schedule.getFieldId(),
                schedule.getScheduleDate(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getPrice(),
                schedule.getStatus()
            ));

            currentStart = currentEnd;
        }

        if (result.isEmpty()) {
            throw new BusinessException("Không tạo được khung giờ nào");
        }

        return result;
    }
}
