package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="payments")
public class Payment {

    @Id
    private String id;

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