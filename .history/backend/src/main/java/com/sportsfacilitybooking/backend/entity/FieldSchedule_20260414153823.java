package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name="field_schedule")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class FieldSchedule {

    @Id
    private String id;

    // LIÊN KẾT: Lịch này là của sân nào
    @ManyToOne
    @JoinColumn(name="field_id")
    private Field field;

    @Column(name="field_id")
    private String fieldId;

    @Column(name="schedule_date")
    private LocalDate scheduleDate;

    @Column(name="start_time")
    private LocalTime startTime;

    @Column(name="end_time")
    private LocalTime endTime;

    private BigDecimal price;

    // AVAILABLE, BOOKED
    private String status;


    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public String getFieldId(){ return fieldId; }
    public void setFieldId(String fieldId){ this.fieldId=fieldId; }

    public LocalDate getScheduleDate(){ return scheduleDate; }
    public void setScheduleDate(LocalDate scheduleDate){ this.scheduleDate=scheduleDate; }

    public LocalTime getStartTime(){ return startTime; }
    public void setStartTime(LocalTime startTime){ this.startTime=startTime; }

    public LocalTime getEndTime(){ return endTime; }
    public void setEndTime(LocalTime endTime){ this.endTime=endTime; }

    public BigDecimal getPrice(){ return price; }
    public void setPrice(BigDecimal price){ this.price=price; }

    public String getStatus(){ return status; }
    public void setStatus(String status){ this.status=status; }
}