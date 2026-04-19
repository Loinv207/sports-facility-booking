package com.sportsfacilitybooking.backend.config;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.sportsfacilitybooking.backend.entity.Field;
import com.sportsfacilitybooking.backend.entity.FieldImage;
import com.sportsfacilitybooking.backend.entity.FieldSchedule;
import com.sportsfacilitybooking.backend.entity.SportsCenter;
import com.sportsfacilitybooking.backend.repository.FieldImageRepository;
import com.sportsfacilitybooking.backend.repository.FieldRepository;
import com.sportsfacilitybooking.backend.repository.FieldScheduleRepository;
import com.sportsfacilitybooking.backend.repository.SportsCenterRepository;

@Configuration
public class FieldSeedConfig {

    @Bean
    @ConditionalOnProperty(name = "app.seed.active-fields", havingValue = "true")
    CommandLineRunner seedActiveFields(
        FieldRepository fieldRepository,
        FieldImageRepository fieldImageRepository,
        FieldScheduleRepository fieldScheduleRepository,
        SportsCenterRepository sportsCenterRepository
    ) {
        return args -> {
            SportsCenter phuNhuanCenter = ensureSportsCenter(
                sportsCenterRepository,
                "Trung tam the thao Phu Nhuan",
                "159 Hoang Van Thu, Phu Nhuan, TP.HCM",
                "TP.HCM"
            );
            SportsCenter quan7Center = ensureSportsCenter(
                sportsCenterRepository,
                "Cum the thao Quan 7",
                "Duong so 9, Tan Kieng, Quan 7, TP.HCM",
                "TP.HCM"
            );
            SportsCenter thuDucCenter = ensureSportsCenter(
                sportsCenterRepository,
                "Sports Hub Thu Duc",
                "Vo Van Ngan, Thu Duc, TP.HCM",
                "TP.HCM"
            );
            SportsCenter binhThanhCenter = ensureSportsCenter(
                sportsCenterRepository,
                "Khu the thao Binh Thanh",
                "Nguyen Huu Canh, Binh Thanh, TP.HCM",
                "TP.HCM"
            );
            SportsCenter tanBinhCenter = ensureSportsCenter(
                sportsCenterRepository,
                "Nha thi dau Tan Binh",
                "Cong Hoa, Tan Binh, TP.HCM",
                "TP.HCM"
            );
            SportsCenter goVapCenter = ensureSportsCenter(
                sportsCenterRepository,
                "Go Vap Arena",
                "Pham Van Chieu, Go Vap, TP.HCM",
                "TP.HCM"
            );

            List<Field> demoFields = List.of(
                createField(
                    "1",
                    "Trung tam the thao Phu Nhuan",
                    "Football",
                    "159 Hoang Van Thu, Phu Nhuan, TP.HCM",
                    new BigDecimal("150000"),
                    4.8,
                    phuNhuanCenter.getId(),
                    "Cum san co nhan tao rong rai, phu hop da dang khung gio tap luyen va thi dau nho."
                ),
                createField(
                    "2",
                    "Cum san cau long Quan 7",
                    "Badminton",
                    "Duong so 9, Tan Kieng, Quan 7, TP.HCM",
                    new BigDecimal("80000"),
                    4.5,
                    quan7Center.getId(),
                    "Khong gian trong nha thoang, he thong den sang ro, phu hop cho nhom ban va lop phong trao."
                ),
                createField(
                    "3",
                    "Khu the thao Binh Thanh",
                    "Football",
                    "Chu Van An, Phuong 12, Binh Thanh, TP.HCM",
                    new BigDecimal("120000"),
                    4.2,
                    binhThanhCenter.getId(),
                    "Co so tong hop co khu san bong, khu cho nghi va bai xe thuan tien cho nguoi choi."
                ),
                createField(
                    "4",
                    "San tennis Thu Duc",
                    "Tennis",
                    "Vo Van Ngan, Thu Duc, TP.HCM",
                    new BigDecimal("180000"),
                    4.7,
                    thuDucCenter.getId(),
                    "Mat san on dinh, lich linh hoat va vi tri de tiep can cho nguoi tap buoi toi."
                ),
                createField(
                    "5",
                    "San bong da Go Vap Arena",
                    "Football",
                    "Pham Van Chieu, Go Vap, TP.HCM",
                    new BigDecimal("140000"),
                    4.4,
                    goVapCenter.getId(),
                    "San co nhan tao 7 nguoi, co den chieu sang va khu vuc cho nghi cho doi bong."
                ),
                createField(
                    "6",
                    "Nha thi dau Cau Long Tan Binh",
                    "Badminton",
                    "Cong Hoa, Tan Binh, TP.HCM",
                    new BigDecimal("95000"),
                    4.6,
                    tanBinhCenter.getId(),
                    "Cum san trong nha co thong gio tot, mat san chuan va phu hop cho ca tap luyen lan thi dau."
                ),
                createField(
                    "7",
                    "San tennis Riverside",
                    "Tennis",
                    "Nguyen Huu Canh, Binh Thanh, TP.HCM",
                    new BigDecimal("220000"),
                    4.9,
                    binhThanhCenter.getId(),
                    "Khong gian cao cap gan trung tam, co bai xe va khu vuc thay do cho nguoi choi."
                ),
                createField(
                    "8",
                    "Khu lien hop the thao Sai Gon East",
                    "Football",
                    "Xa Lo Ha Noi, Thu Duc, TP.HCM",
                    new BigDecimal("170000"),
                    4.3,
                    thuDucCenter.getId(),
                    "Co nhieu san hoat dong song song, phu hop to chuc giao huu va dat lich theo nhom dong."
                ),
                createField(
                    "9",
                    "Cum san cau long An Phu",
                    "Badminton",
                    "Mai Chi Tho, An Phu, Thu Duc, TP.HCM",
                    new BigDecimal("105000"),
                    4.7,
                    thuDucCenter.getId(),
                    "San moi, anh sang tot, phu hop cho nguoi choi phong trao va cac lop hoc cuoi tuan."
                )
            );

            demoFields.forEach(field -> {
                Field savedField = ensureField(fieldRepository, fieldImageRepository, fieldScheduleRepository, field);
                ensureFieldImage(fieldImageRepository, savedField.getId(), imageForField(savedField.getFieldName()));
            });
        };
    }

    private SportsCenter ensureSportsCenter(
        SportsCenterRepository sportsCenterRepository,
        String name,
        String address,
        String city
    ) {
        return sportsCenterRepository.findByNameIgnoreCase(name)
            .map(existing -> {
                existing.setAddress(address);
                existing.setCity(city);
                existing.setApprovalStatus("APPROVED");
                if (existing.getCreatedAt() == null) {
                    existing.setCreatedAt(LocalDateTime.now());
                }
                return sportsCenterRepository.save(existing);
            })
            .orElseGet(() -> {
                SportsCenter sportsCenter = new SportsCenter();
                sportsCenter.setId(UUID.randomUUID().toString());
                sportsCenter.setName(name);
                sportsCenter.setAddress(address);
                sportsCenter.setCity(city);
                sportsCenter.setApprovalStatus("APPROVED");
                sportsCenter.setCreatedAt(LocalDateTime.now());
                return sportsCenterRepository.save(sportsCenter);
            });
    }

    private Field ensureField(
        FieldRepository fieldRepository,
        FieldImageRepository fieldImageRepository,
        FieldScheduleRepository fieldScheduleRepository,
        Field demoField
    ) {
        return fieldRepository.findById(demoField.getId())
            .map(existingById -> updateField(fieldRepository, existingById, demoField))
            .orElseGet(() -> fieldRepository.findByFieldNameIgnoreCase(demoField.getFieldName())
                .map(existingByName -> migrateFieldToExpectedId(
                    fieldRepository,
                    fieldImageRepository,
                    fieldScheduleRepository,
                    existingByName,
                    demoField
                ))
                .orElseGet(() -> fieldRepository.save(demoField))
            );
    }

    private Field updateField(FieldRepository fieldRepository, Field target, Field demoField) {
        target.setFieldName(demoField.getFieldName());
        target.setSportsType(demoField.getSportsType());
        target.setAddress(demoField.getAddress());
        target.setPrice(demoField.getPrice());
        target.setRating(demoField.getRating());
        target.setSportsCenterId(demoField.getSportsCenterId());
        target.setDescription(demoField.getDescription());
        target.setStatus("ACTIVE");
        return fieldRepository.save(target);
    }

    private Field migrateFieldToExpectedId(
        FieldRepository fieldRepository,
        FieldImageRepository fieldImageRepository,
        FieldScheduleRepository fieldScheduleRepository,
        Field existingField,
        Field demoField
    ) {
        if (existingField.getId().equals(demoField.getId())) {
            return updateField(fieldRepository, existingField, demoField);
        }

        Field targetField = fieldRepository.findById(demoField.getId())
            .map(existingById -> updateField(fieldRepository, existingById, demoField))
            .orElseGet(() -> fieldRepository.save(demoField));

        moveImages(fieldImageRepository, existingField.getId(), targetField.getId());
        moveSchedules(fieldScheduleRepository, existingField.getId(), targetField.getId());
        markAsMigrated(fieldRepository, existingField);

        return targetField;
    }

    private void markAsMigrated(FieldRepository fieldRepository, Field existingField) {
        existingField.setFieldName(existingField.getFieldName() + " [MIGRATED " + existingField.getId() + "]");
        existingField.setStatus("MIGRATED");
        fieldRepository.save(existingField);
    }

    private void moveImages(FieldImageRepository fieldImageRepository, String oldFieldId, String newFieldId) {
        fieldImageRepository.findByFieldIdOrderByIdAsc(oldFieldId).forEach(image -> {
            if (fieldImageRepository.existsByFieldIdAndImageUrl(newFieldId, image.getImageUrl())) {
                fieldImageRepository.delete(image);
                return;
            }

            image.setFieldId(newFieldId);
            fieldImageRepository.save(image);
        });
    }

    private void moveSchedules(FieldScheduleRepository fieldScheduleRepository, String oldFieldId, String newFieldId) {
        List<FieldSchedule> schedules = fieldScheduleRepository.findByFieldIdOrderByScheduleDateAscStartTimeAsc(oldFieldId);
        schedules.forEach(schedule -> schedule.setFieldId(newFieldId));
        if (!schedules.isEmpty()) {
            fieldScheduleRepository.saveAll(schedules);
        }
    }

    private void ensureFieldImage(FieldImageRepository fieldImageRepository, String fieldId, String imageUrl) {
        if (fieldImageRepository.existsByFieldIdAndImageUrl(fieldId, imageUrl)) {
            return;
        }

        FieldImage fieldImage = new FieldImage();
        fieldImage.setId(UUID.randomUUID().toString());
        fieldImage.setFieldId(fieldId);
        fieldImage.setImageUrl(imageUrl);
        fieldImageRepository.save(fieldImage);
    }

    private Field createField(
        String id,
        String fieldName,
        String sportsType,
        String address,
        BigDecimal price,
        Double rating,
        String sportsCenterId,
        String description
    ) {
        Field field = new Field();
        field.setId(id);
        field.setFieldName(fieldName);
        field.setSportsType(sportsType);
        field.setAddress(address);
        field.setPrice(price);
        field.setRating(rating);
        field.setSportsCenterId(sportsCenterId);
        field.setDescription(description);
        field.setStatus("ACTIVE");
        return field;
    }

    private String imageForField(String fieldName) {
        return switch (fieldName) {
            case "Cum san cau long Quan 7", "Nha thi dau Cau Long Tan Binh", "Cum san cau long An Phu" ->
                "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1200";
            case "San tennis Thu Duc", "San tennis Riverside" ->
                "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1200";
            default ->
                "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200";
        };
    }
}
