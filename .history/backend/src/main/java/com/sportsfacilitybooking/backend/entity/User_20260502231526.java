
package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;

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

    private String status = "ACTIVE";

    @Column(name = "avatar_url", columnDefinition = "LONGTEXT")
    private String avatarUrl;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne
    @JoinColumn(name = "user_profile_id") 
    private UserProfile userProfile;


}
