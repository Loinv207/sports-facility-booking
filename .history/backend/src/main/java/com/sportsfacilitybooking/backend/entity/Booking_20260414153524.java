package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import lombok.*; // Dùng dấu * để import gọn hết các annotation của lombok
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // LIÊN KẾT: Một user có nhiều lần đặt sân
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // LIÊN KẾT: Một đơn đặt sân ứng với một khung giờ cụ thể
    @ManyToOne
    @JoinColumn(name = "schedule_id")
    private FieldSchedule fieldSchedule;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    // PENDING, CONFIRMED, CANCELLED
    private String status;

    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // KHÔNG viết thêm bất kỳ Getter, Setter hay Constructor nào ở đây nữa!
}