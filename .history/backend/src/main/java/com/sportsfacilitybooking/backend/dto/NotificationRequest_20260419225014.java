package com.sportsfacilitybooking.backend.dto;

public class NotificationRequest {
    private String title;
    private String message;
    private Long userId; // Hoặc String tùy theo kiểu dữ liệu ID của bảng User
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    
}
