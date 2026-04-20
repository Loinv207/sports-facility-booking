package com.sportsfacilitybooking.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportsfacilitybooking.backend.dto.NotificationRequest;
import com.sportsfacilitybooking.backend.entity.Notification;
import com.sportsfacilitybooking.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody NotificationRequest request) {
        // 1. Tìm user nhận thông báo
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        // 2. Tạo đối tượng Notification từ request
        Notification notification = new Notification();
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setUser(user); // Gán user vào đây
        
        // Các trường id, isRead, createdAt đã có giá trị mặc định trong Entity

        // 3. Lưu vào DB
        Notification savedNote = notificationRepository.save(notification);
        
        return ResponseEntity.ok(savedNote);
    }
}