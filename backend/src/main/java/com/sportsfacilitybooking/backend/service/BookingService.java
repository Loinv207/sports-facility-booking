package com.sportsfacilitybooking.backend.service;

import java.util.Map;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportsfacilitybooking.backend.dto.CreateBookingRequest;
import com.sportsfacilitybooking.backend.dto.CreateBookingResponse;
import com.sportsfacilitybooking.backend.dto.UserBookingResponse;
import com.sportsfacilitybooking.backend.entity.Booking;
import com.sportsfacilitybooking.backend.entity.Field;
import com.sportsfacilitybooking.backend.entity.FieldSchedule;
import com.sportsfacilitybooking.backend.entity.Payment;
import com.sportsfacilitybooking.backend.entity.User;
import com.sportsfacilitybooking.backend.exception.BookingConflictException;
import com.sportsfacilitybooking.backend.exception.BusinessException;
import com.sportsfacilitybooking.backend.exception.ResourceNotFoundException;
import com.sportsfacilitybooking.backend.repository.BookingRepository;
import com.sportsfacilitybooking.backend.repository.FieldRepository;
import com.sportsfacilitybooking.backend.repository.FieldScheduleRepository;
import com.sportsfacilitybooking.backend.repository.PaymentRepository;
import com.sportsfacilitybooking.backend.repository.UserRepository;

@Service
public class BookingService {
    private static final List<String> BLOCKING_BOOKING_STATUSES = List.of("PENDING_PAYMENT", "PAID");

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final FieldRepository fieldRepository;
    private final FieldScheduleRepository fieldScheduleRepository;
    private final UserRepository userRepository;

    public BookingService(
        BookingRepository bookingRepository,
        PaymentRepository paymentRepository,
        FieldRepository fieldRepository,
        FieldScheduleRepository fieldScheduleRepository,
        UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.fieldRepository = fieldRepository;
        this.fieldScheduleRepository = fieldScheduleRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CreateBookingResponse createBooking(CreateBookingRequest request, String username) {
        if (username == null || username.isBlank()) {
            throw new BusinessException("Ban can dang nhap de tao booking");
        }

        User user = userRepository.findByUsername(username)
            .or(() -> userRepository.findByEmail(username))
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay nguoi dung dang nhap"));

        FieldSchedule schedule = fieldScheduleRepository.findById(request.fieldScheduleId())
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay lich san voi id: " + request.fieldScheduleId()));

        Field field = fieldRepository.findById(schedule.getFieldId())
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay san voi id: " + schedule.getFieldId()));

        if (!"AVAILABLE".equalsIgnoreCase(schedule.getStatus())) {
            throw new BookingConflictException("Khung gio nay khong con san sang de dat");
        }

        boolean booked = bookingRepository.existsByFieldScheduleIdAndStatusIn(
            schedule.getId(),
            BLOCKING_BOOKING_STATUSES
        );
        if (booked) {
            throw new BookingConflictException("Khung gio nay da co booking cho xu ly thanh toan hoac da thanh toan");
        }

        LocalDateTime createdAt = LocalDateTime.now();

        Booking booking = new Booking();
        booking.setId(UUID.randomUUID().toString());
        booking.setUserId(user.getId());
        booking.setFieldId(schedule.getFieldId());
        booking.setFieldScheduleId(schedule.getId());
        booking.setFieldName(field.getFieldName());
        booking.setCustomerName(displayName(user));
        booking.setBookingDate(schedule.getScheduleDate());
        booking.setStartTime(schedule.getStartTime() != null ? schedule.getStartTime().toString() : null);
        booking.setEndTime(schedule.getEndTime() != null ? schedule.getEndTime().toString() : null);
        booking.setDepositAmount(schedule.getPrice());
        booking.setTotalPrice(schedule.getPrice());
        booking.setStatus("PENDING_PAYMENT");
        booking.setCreatedAt(createdAt);
        bookingRepository.save(booking);

        Payment payment = new Payment();
        payment.setId(UUID.randomUUID().toString());
        payment.setBookingId(booking.getId());
        payment.setAmount(schedule.getPrice());
        payment.setPaymentMethod(request.paymentMethod().trim());
        payment.setPaymentStatus("PENDING");
        payment.setCreatedAt(createdAt);
        paymentRepository.save(payment);

        schedule.setStatus("RESERVED");
        fieldScheduleRepository.save(schedule);

        return new CreateBookingResponse(
            booking.getId(),
            booking.getUserId(),
            booking.getFieldId(),
            booking.getFieldScheduleId(),
            booking.getBookingDate(),
            schedule.getStartTime(),
            schedule.getEndTime(),
            booking.getTotalPrice(),
            booking.getStatus(),
            payment.getId(),
            payment.getPaymentMethod(),
            payment.getPaymentStatus(),
            booking.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<UserBookingResponse> getUserBookings(String username) {
        User user = findCurrentUser(username);
        List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        if (bookings.isEmpty()) {
            return List.of();
        }

        Map<String, FieldSchedule> schedulesById = fieldScheduleRepository.findAllById(
            bookings.stream().map(Booking::getFieldScheduleId).toList()
        ).stream().collect(Collectors.toMap(FieldSchedule::getId, Function.identity()));

        Map<String, Field> fieldsById = fieldRepository.findAllById(
            bookings.stream().map(Booking::getFieldId).toList()
        ).stream().collect(Collectors.toMap(Field::getId, Function.identity()));

        Map<String, Payment> paymentByBookingId = paymentRepository.findByBookingIdIn(
            bookings.stream().map(Booking::getId).toList()
        ).stream().collect(Collectors.toMap(Payment::getBookingId, Function.identity(), (left, right) -> left));

        return bookings.stream()
            .map(booking -> toUserBookingResponse(
                booking,
                schedulesById.get(booking.getFieldScheduleId()),
                fieldsById.get(booking.getFieldId()),
                paymentByBookingId.get(booking.getId())
            ))
            .toList();
    }

    @Transactional
    public UserBookingResponse cancelBooking(String bookingId, String username) {
        User user = findCurrentUser(username);

        Booking booking = bookingRepository.findByIdAndUserId(bookingId, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay booking cua nguoi dung voi id: " + bookingId));

        if (!"PENDING_PAYMENT".equalsIgnoreCase(booking.getStatus())) {
            throw new BusinessException("Chi duoc huy booking khi dang o trang thai PENDING_PAYMENT");
        }

        FieldSchedule schedule = fieldScheduleRepository.findById(booking.getFieldScheduleId())
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay lich san cua booking: " + bookingId));

        Payment payment = paymentRepository.findByBookingId(booking.getId()).orElse(null);

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        if (payment != null) {
            payment.setPaymentStatus("CANCELLED");
            paymentRepository.save(payment);
        }

        schedule.setStatus("AVAILABLE");
        fieldScheduleRepository.save(schedule);

        Field field = fieldRepository.findById(booking.getFieldId()).orElse(null);

        return toUserBookingResponse(booking, schedule, field, payment);
    }

    private User findCurrentUser(String username) {
        if (username == null || username.isBlank()) {
            throw new BusinessException("Ban can dang nhap de su dung chuc nang nay");
        }

        return userRepository.findByUsername(username)
            .or(() -> userRepository.findByEmail(username))
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay nguoi dung dang nhap"));
    }

    private String displayName(User user) {
        if (user.getFullName() != null && !user.getFullName().isBlank()) {
            return user.getFullName().trim();
        }

        if (user.getUsername() != null && !user.getUsername().isBlank()) {
            return user.getUsername().trim();
        }

        return user.getEmail();
    }

    private UserBookingResponse toUserBookingResponse(
        Booking booking,
        FieldSchedule schedule,
        Field field,
        Payment payment
    ) {
        return new UserBookingResponse(
            booking.getId(),
            booking.getFieldId(),
            field != null ? field.getFieldName() : null,
            booking.getFieldScheduleId(),
            booking.getBookingDate(),
            schedule != null ? schedule.getStartTime() : null,
            schedule != null ? schedule.getEndTime() : null,
            booking.getTotalPrice(),
            booking.getStatus(),
            payment != null ? payment.getId() : null,
            payment != null ? payment.getPaymentMethod() : null,
            payment != null ? payment.getPaymentStatus() : null,
            booking.getCreatedAt()
        );
    }
}
