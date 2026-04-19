package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="notifications")
public class Notification {

    @Id
    private String id = UUID.randomUUID().toString();

    private String title;
    private String message;

    @Column(name="is_read")
    private Boolean isRead;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    public Notification(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public String getTitle(){ return title; }
    public void setTitle(String title){ this.title=title; }

    public String getMessage(){ return message; }
    public void setMessage(String message){ this.message=message; }

    public Boolean getIsRead(){ return isRead; }
    public void setIsRead(Boolean isRead){ this.isRead=isRead; }

    public LocalDateTime getCreatedAt(){ return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt=createdAt; }
}