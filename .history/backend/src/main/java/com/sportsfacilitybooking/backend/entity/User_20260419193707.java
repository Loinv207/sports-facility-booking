
package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor 
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username; 

    private String email; 

    @Column(name = "password_hash")
    private String passwordHash;

    private String fullName; 

    @Column(name = "phone_number")
    private String phoneNumber; 

    @Enumerated(EnumType.STRING) 
    private Role role; 

    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToOne
    @JoinColumn(name = "user_profile_id") // Tên cột liên kết trong DB
    private UserProfile userProfile;

    
}
