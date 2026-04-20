package com.sportsfacilitybooking.backend.entity;

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

    public SystemReport(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public String getReportType(){ return reportType; }
    public void setReportType(String reportType){ this.reportType=reportType; }

    public LocalDateTime getCreatedAt(){ return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt=createdAt; }
}