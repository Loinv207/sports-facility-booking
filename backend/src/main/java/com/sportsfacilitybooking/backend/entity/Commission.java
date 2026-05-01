package com.sportsfacilitybooking.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(name = "updated_by_admin_id")
    private Long updatedByAdminId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by_admin_id", insertable = false, updatable = false)
    @JsonIgnore
    private User updatedByAdmin;

    public Commission(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public BigDecimal getCommissionRate(){ return commissionRate; }
    public void setCommissionRate(BigDecimal commissionRate){ this.commissionRate=commissionRate; }

    public BigDecimal getCommissionAmount(){ return commissionAmount; }
    public void setCommissionAmount(BigDecimal commissionAmount){ this.commissionAmount=commissionAmount; }

    public Long getUpdatedByAdminId(){ return updatedByAdminId; }
    public void setUpdatedByAdminId(Long updatedByAdminId){ this.updatedByAdminId=updatedByAdminId; }

    public User getUpdatedByAdmin(){ return updatedByAdmin; }
    public void setUpdatedByAdmin(User updatedByAdmin){ this.updatedByAdmin=updatedByAdmin; }
}
