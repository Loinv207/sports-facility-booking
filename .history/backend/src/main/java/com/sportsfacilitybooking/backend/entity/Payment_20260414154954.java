package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="payments")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // LIÊN KẾT: Một thanh toán chỉ thuộc về một đơn đặt sân
    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    private BigDecimal amount;

    @Column(name="payment_method")
    private String paymentMethod; // VNPAY, MOMO, CASH

    @Column(name="payment_status")
    private String paymentStatus; // SUCCESS, FAILED

    @Column(name="transaction_id")
    private String transactionId; // Mã giao dịch từ cổng thanh toán

    @Column(name="created_at")
    private LocalDateTime createdAt;

    // public String getId(){ return id; }
    // public void setId(String id){ this.id=id; }

    // public BigDecimal getAmount(){ return amount; }
    // public void setAmount(BigDecimal amount){ this.amount=amount; }

    // public String getPaymentMethod(){ return paymentMethod; }
    // public void setPaymentMethod(String paymentMethod){ this.paymentMethod=paymentMethod; }

    // public String getPaymentStatus(){ return paymentStatus; }
    // public void setPaymentStatus(String paymentStatus){ this.paymentStatus=paymentStatus; }

    // public String getTransactionId(){ return transactionId; }
    // public void setTransactionId(String transactionId){ this.transactionId=transactionId; }

    // public LocalDateTime getCreatedAt(){ return createdAt; }
    // public void setCreatedAt(LocalDateTime createdAt){ this.createdAt=createdAt; }
}