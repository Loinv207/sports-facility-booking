// package com.sportsfacilitybooking.backend.entity;


// import jakarta.persistence.*;
// import java.time.LocalDateTime;


// @Entity
// @Table(name = "users")
// public class User {

//     @Id
//     private String id;

//     private String username;

//     private String email;

//     @Column(name = "password_hash")
//     private String passwordHash;

//     @Column(name = "phone_number")
//     private String phoneNumber;

//     private String role;

//     private String status;

//     @Column(name = "created_at")
//     private LocalDateTime createdAt;

//     public User() {
//     }

//     public String getId() {
//         return id;
//     }

//     public void setId(String id) {
//         this.id = id;
//     }

//     public String getUsername() {
//         return username;
//     }

//     public void setUsername(String username) {
//         this.username = username;
//     }

//     public String getEmail() {
//         return email;
//     }

//     public void setEmail(String email) {
//         this.email = email;
//     }

//     public String getPasswordHash() {
//         return passwordHash;
//     }

//     public void setPasswordHash(String passwordHash) {
//         this.passwordHash = passwordHash;
//     }

//     public String getPhoneNumber() {
//         return phoneNumber;
//     }

//     public void setPhoneNumber(String phoneNumber) {
//         this.phoneNumber = phoneNumber;
//     }

//     public String getRole() {
//         return role;
//     }

//     public void setRole(String role) {
//         this.role = role;
//     }

//     public String getStatus() {
//         return status;
//     }

//     public void setStatus(String status) {
//         this.status = status;
//     }

//     public LocalDateTime getCreatedAt() {
//         return createdAt;
//     }

//     public void setCreatedAt(LocalDateTime createdAt) {
//         this.createdAt = createdAt;
//     }
// }




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

    @Enumerated(EnumType.STRING) // Lưu vào DB dưới dạng chuỗi "USER", "ADMIN" thay vì số 0, 1
    private Role role; 

    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
