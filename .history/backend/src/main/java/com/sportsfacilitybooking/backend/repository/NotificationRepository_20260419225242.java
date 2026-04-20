package com.sportsfacilitybooking.backend.repository;

import com.sportsfacilitybooking.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    
    // Tìm tất cả thông báo của một user cụ thể (sắp xếp mới nhất lên đầu)
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Đếm số thông báo chưa đọc của user
    long countByUserIdAndIsReadFalse(Long userId);
}