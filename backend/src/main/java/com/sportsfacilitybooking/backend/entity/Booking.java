package com.sportsfacilitybooking.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "field_id", nullable = false)
    private String fieldId;

    @Column(name = "field_schedule_id", nullable = false)
    private String fieldScheduleId;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    private String status;

    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Booking() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFieldId() {
        return fieldId;
    }

    public void setFieldId(String fieldId) {
        this.fieldId = fieldId;
    }

    public String getFieldScheduleId() {
        return fieldScheduleId;
    }

    public void setFieldScheduleId(String fieldScheduleId) {
        this.fieldScheduleId = fieldScheduleId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCheckedInAt() {
        return checkedInAt;
    }

    public void setCheckedInAt(LocalDateTime checkedInAt) {
        this.checkedInAt = checkedInAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
