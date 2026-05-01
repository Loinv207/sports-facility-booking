package com.sportsfacilitybooking.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="payments")
public class Payment {

    @Id
    private String id;

    @Column(name = "booking_id", nullable = false)
    private String bookingId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", insertable = false, updatable = false)
    private Booking booking;

    private BigDecimal amount;

    @Column(name="payment_method")
    private String paymentMethod;

    @Column(name="payment_status")
    private String paymentStatus;

    @Column(name="transaction_id")
    private String transactionId;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    public Payment(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public BigDecimal getAmount(){ return amount; }
    public void setAmount(BigDecimal amount){ this.amount=amount; }

    public String getPaymentMethod(){ return paymentMethod; }
    public void setPaymentMethod(String paymentMethod){ this.paymentMethod=paymentMethod; }

    public String getPaymentStatus(){ return paymentStatus; }
    public void setPaymentStatus(String paymentStatus){ this.paymentStatus=paymentStatus; }

    public String getTransactionId(){ return transactionId; }
    public void setTransactionId(String transactionId){ this.transactionId=transactionId; }

    public LocalDateTime getCreatedAt(){ return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt=createdAt; }
}
