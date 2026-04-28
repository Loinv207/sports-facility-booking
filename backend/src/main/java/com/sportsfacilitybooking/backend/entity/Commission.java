package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name="commissions")
public class Commission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name="commission_rate")
    private BigDecimal commissionRate;

    @Column(name="commission_amount")
    private BigDecimal commissionAmount;

    public Commission(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public BigDecimal getCommissionRate(){ return commissionRate; }
    public void setCommissionRate(BigDecimal commissionRate){ this.commissionRate=commissionRate; }

    public BigDecimal getCommissionAmount(){ return commissionAmount; }
    public void setCommissionAmount(BigDecimal commissionAmount){ this.commissionAmount=commissionAmount; }
}