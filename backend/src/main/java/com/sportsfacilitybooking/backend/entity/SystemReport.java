package com.sportsfacilitybooking.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="system_reports")
public class SystemReport {

    @Id
    private String id;

    @Column(name="report_type")
    private String reportType;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    @Column(name="total_revenue")
    private Double totalRevenue; 

    @Column(name="total_bookings")
    private Integer totalBookings;

    @Column(name = "created_by_admin_id")
    private Long createdByAdminId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_admin_id", insertable = false, updatable = false)
    @JsonIgnore
    private User createdByAdmin;

    public SystemReport(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public String getReportType(){ return reportType; }
    public void setReportType(String reportType){ this.reportType=reportType; }

    public LocalDateTime getCreatedAt(){ return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt=createdAt; }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Integer getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Integer totalBookings) {
        this.totalBookings = totalBookings;
    }

    public Long getCreatedByAdminId() {
        return createdByAdminId;
    }

    public void setCreatedByAdminId(Long createdByAdminId) {
        this.createdByAdminId = createdByAdminId;
    }

    public User getCreatedByAdmin() {
        return createdByAdmin;
    }

    public void setCreatedByAdmin(User createdByAdmin) {
        this.createdByAdmin = createdByAdmin;
    }

        
}
