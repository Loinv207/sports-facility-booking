package com.sportsfacilitybooking.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportsfacilitybooking.backend.dto.OwnerBookingResponse;
import com.sportsfacilitybooking.backend.dto.OwnerBookingStatusRequest;
import com.sportsfacilitybooking.backend.dto.OwnerCheckInRequest;
import com.sportsfacilitybooking.backend.dto.OwnerRevenueReportResponse;
import com.sportsfacilitybooking.backend.entity.Booking;
import com.sportsfacilitybooking.backend.entity.Field;
import com.sportsfacilitybooking.backend.exception.BusinessException;
import com.sportsfacilitybooking.backend.exception.ResourceNotFoundException;
import com.sportsfacilitybooking.backend.repository.BookingRepository;
import com.sportsfacilitybooking.backend.repository.FieldRepository;

@Service
public class OwnerBookingService {
    private static final DateTimeFormatter LABEL_FORMATTER = DateTimeFormatter.ofPattern("dd/MM", Locale.forLanguageTag("vi-VN"));

    private final BookingRepository bookingRepository;
    private final FieldRepository fieldRepository;

    public OwnerBookingService(BookingRepository bookingRepository, FieldRepository fieldRepository) {
        this.bookingRepository = bookingRepository;
        this.fieldRepository = fieldRepository;
    }

    public List<OwnerBookingResponse> getOwnerBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public OwnerBookingResponse updateBookingStatus(String bookingId, OwnerBookingStatusRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay booking voi id: " + bookingId));

        String nextStatus = normalizeStatus(request.status());
        if (!nextStatus.equals("CONFIRMED") && !nextStatus.equals("REJECTED")) {
            throw new BusinessException("Owner chi duoc chuyen booking sang CONFIRMED hoac REJECTED");
        }

        booking.setStatus(nextStatus);
        booking.setNote(cleanText(request.note()));

        bookingRepository.save(booking);
        return toResponse(booking);
    }

    @Transactional
    public OwnerBookingResponse checkIn(OwnerCheckInRequest request) {
        Booking booking = bookingRepository.findById(request.bookingId())
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay booking voi id: " + request.bookingId()));

        String currentStatus = normalizeStatus(booking.getStatus());
        if (!currentStatus.equals("CONFIRMED") && !currentStatus.equals("COMPLETED")) {
            throw new BusinessException("Chi booking da duoc xac nhan moi co the check-in");
        }

        booking.setStatus("COMPLETED");
        booking.setCheckedInAt(LocalDateTime.now());
        booking.setExtraCash(safeAmount(request.extraCash()));
        booking.setNote(cleanText(request.note()));

        bookingRepository.save(booking);
        return toResponse(booking);
    }

    public OwnerRevenueReportResponse getRevenueReport() {
        List<Booking> bookings = bookingRepository.findAllByOrderByCreatedAtDesc();

        BigDecimal totalDepositOnline = sum(bookings.stream()
            .map(Booking::getDepositAmount)
            .toList());

        BigDecimal totalExtraCash = sum(bookings.stream()
            .filter(booking -> "COMPLETED".equals(normalizeStatus(booking.getStatus())))
            .map(Booking::getExtraCash)
            .toList());

        BigDecimal totalRevenue = totalDepositOnline.add(totalExtraCash);

        long completedBookings = bookings.stream()
            .filter(booking -> "COMPLETED".equals(normalizeStatus(booking.getStatus())))
            .count();

        long confirmedBookings = bookings.stream()
            .filter(booking -> "CONFIRMED".equals(normalizeStatus(booking.getStatus())))
            .count();

        Map<LocalDate, RevenueAccumulator> grouped = new TreeMap<>();
        bookings.stream()
            .sorted(Comparator.comparing(Booking::getBookingDate, Comparator.nullsLast(Comparator.naturalOrder())))
            .forEach(booking -> {
                LocalDate bookingDate = Optional.ofNullable(booking.getBookingDate())
                    .orElseGet(() -> Optional.ofNullable(booking.getCreatedAt()).map(LocalDateTime::toLocalDate).orElse(LocalDate.now()));

                RevenueAccumulator bucket = grouped.computeIfAbsent(bookingDate, ignored -> new RevenueAccumulator());
                bucket.depositOnline = bucket.depositOnline.add(safeAmount(booking.getDepositAmount()));
                if ("COMPLETED".equals(normalizeStatus(booking.getStatus()))) {
                    bucket.extraCash = bucket.extraCash.add(safeAmount(booking.getExtraCash()));
                }
            });

        List<OwnerRevenueReportResponse.OwnerRevenuePoint> chart = grouped.entrySet().stream()
            .map(entry -> new OwnerRevenueReportResponse.OwnerRevenuePoint(
                entry.getKey().format(LABEL_FORMATTER),
                entry.getValue().depositOnline,
                entry.getValue().extraCash,
                entry.getValue().depositOnline.add(entry.getValue().extraCash)
            ))
            .toList();

        return new OwnerRevenueReportResponse(
            totalDepositOnline,
            totalExtraCash,
            totalRevenue,
            completedBookings,
            confirmedBookings,
            chart
        );
    }

    @Transactional
    public void seedDemoBookingsIfEmpty() {
        if (bookingRepository.count() > 0) {
            return;
        }

        List<Field> fields = fieldRepository.findAll();
        if (fields.isEmpty()) {
            return;
        }

        Field firstField = fields.get(0);
        Field secondField = fields.size() > 1 ? fields.get(1) : firstField;

        bookingRepository.save(createDemoBooking(firstField, "Nguyen Van A", LocalDate.now().plusDays(1), "18:00", "19:00", new BigDecimal("120000"), null, new BigDecimal("400000"), "PENDING"));
        bookingRepository.save(createDemoBooking(firstField, "Tran Thi B", LocalDate.now(), "19:00", "20:00", new BigDecimal("150000"), null, new BigDecimal("450000"), "CONFIRMED"));
        bookingRepository.save(createDemoBooking(secondField, "Le Van C", LocalDate.now().minusDays(1), "17:00", "18:00", new BigDecimal("100000"), new BigDecimal("50000"), new BigDecimal("350000"), "COMPLETED"));
    }

    private Booking createDemoBooking(Field field, String customerName, LocalDate bookingDate, String startTime, String endTime, BigDecimal depositAmount, BigDecimal extraCash, BigDecimal totalPrice, String status) {
        Booking booking = new Booking();
        booking.setId(UUID.randomUUID().toString());
        booking.setFieldId(field.getId());
        booking.setFieldName(field.getFieldName());
        booking.setCustomerName(customerName);
        booking.setBookingDate(bookingDate);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setDepositAmount(depositAmount);
        booking.setExtraCash(extraCash);
        booking.setTotalPrice(totalPrice);
        booking.setStatus(status);
        booking.setCreatedAt(LocalDateTime.now().minusHours(2));
        if ("COMPLETED".equals(status)) {
            booking.setCheckedInAt(LocalDateTime.now().minusHours(1));
        }
        return booking;
    }

    private OwnerBookingResponse toResponse(Booking booking) {
        return new OwnerBookingResponse(
            booking.getId(),
            booking.getFieldId(),
            booking.getFieldName(),
            booking.getCustomerName(),
            booking.getBookingDate(),
            booking.getStartTime(),
            booking.getEndTime(),
            safeAmount(booking.getDepositAmount()),
            safeAmount(booking.getExtraCash()),
            safeAmount(booking.getTotalPrice()),
            normalizeStatus(booking.getStatus()),
            booking.getNote(),
            booking.getCheckedInAt(),
            booking.getCreatedAt()
        );
    }

    private String normalizeStatus(String status) {
        return status == null ? "PENDING" : status.trim().toUpperCase(Locale.ROOT);
    }

    private String cleanText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private BigDecimal safeAmount(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private BigDecimal sum(List<BigDecimal> values) {
        return values.stream().map(this::safeAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private static class RevenueAccumulator {
        private BigDecimal depositOnline = BigDecimal.ZERO;
        private BigDecimal extraCash = BigDecimal.ZERO;
    }
}
