package com.sportsfacilitybooking.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sportsfacilitybooking.backend.dto.NotificationRequest;
import com.sportsfacilitybooking.backend.entity.Notification;
import com.sportsfacilitybooking.backend.entity.User;
import com.sportsfacilitybooking.backend.repository.NotificationRepository;
import com.sportsfacilitybooking.backend.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    
    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody NotificationRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Notification notification = new Notification();
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setUser(user); 
        
        return ResponseEntity.ok(notificationRepository.save(notification));
    }

    
    @PostMapping("/broadcast")
    public ResponseEntity<?> broadcastNotification(
            @RequestBody NotificationRequest request, 
            @RequestParam(defaultValue = "ALL") String target) {
        
        List<User> targets;

        
        if ("USER".equalsIgnoreCase(target)) {
            targets = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && u.getRole().name().contains("USER"))
                .collect(Collectors.toList());
        } else if ("OWNER".equalsIgnoreCase(target)) {
            targets = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && u.getRole().name().contains("OWNER"))
                .collect(Collectors.toList());
        } else {
            targets = userRepository.findAll();
        }

        
        List<Notification> batchNotifications = targets.stream().map(user -> {
            Notification note = new Notification();
            note.setTitle(request.getTitle());
            note.setMessage(request.getMessage());
            note.setUser(user);
            return note;
        }).collect(Collectors.toList());

        notificationRepository.saveAll(batchNotifications);
        
        return ResponseEntity.ok("Đã gửi thông báo thành công tới " + targets.size() + " người dùng.");
    }
}