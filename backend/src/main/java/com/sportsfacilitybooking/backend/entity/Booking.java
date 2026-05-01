package com.sportsfacilitybooking.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    private String id;

    @Column(name = "user_id")
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "field_id")
    private String fieldId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", insertable = false, updatable = false)
    private Field field;

    @Column(name = "field_schedule_id")
    private String fieldScheduleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_schedule_id", insertable = false, updatable = false)
    private FieldSchedule fieldSchedule;

    @OneToOne(mappedBy = "booking", fetch = FetchType.LAZY)
    private Payment payment;

    @Column(name = "field_name")
    private String fieldName;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @Column(name = "start_time")
    private String startTime;

    @Column(name = "end_time")
    private String endTime;

    @Column(name = "deposit_amount")
    private BigDecimal depositAmount;

    @Column(name = "extra_cash")
    private BigDecimal extraCash;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    private String status;

    private String note;

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFieldId() {
        return fieldId;
    }

    public void setFieldId(String fieldId) {
        this.fieldId = fieldId;
    }

    public Field getField() {
        return field;
    }

    public void setField(Field field) {
        this.field = field;
    }

    public String getFieldScheduleId() {
        return fieldScheduleId;
    }

    public void setFieldScheduleId(String fieldScheduleId) {
        this.fieldScheduleId = fieldScheduleId;
    }

    public FieldSchedule getFieldSchedule() {
        return fieldSchedule;
    }

    public void setFieldSchedule(FieldSchedule fieldSchedule) {
        this.fieldSchedule = fieldSchedule;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public BigDecimal getDepositAmount() {
        return depositAmount;
    }

    public void setDepositAmount(BigDecimal depositAmount) {
        this.depositAmount = depositAmount;
    }

    public BigDecimal getExtraCash() {
        return extraCash;
    }

    public void setExtraCash(BigDecimal extraCash) {
        this.extraCash = extraCash;
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

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
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
