package com.sportsfacilitybooking.backend.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_users_username", columnList = "username", unique = true),
        @Index(name = "idx_users_email", columnList = "email", unique = true)
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(name = "full_name", length = 255)
    private String fullname;

    @Column(name = "create_at", nullable = false, updatable = false)
    private Instant createAt;

    @Column(name = "update_at")
    private Instant updateAt;

    @PrePersist
    protected void onCreate() {
        createAt = Instant.now();
        updateAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updateAt = Instant.now();
    }

    // ===== Getter & Setter =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public Instant getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Instant createAt) {
        this.createAt = createAt;
    }

    public Instant getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(Instant updateAt) {
        this.updateAt = updateAt;
    }

    public User(
            Long id,
            String username,
            String email,
            String passwordHash,
            Role role,
            String fullname,
            Instant createAt,
            Instant updateAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.fullname = fullname;
    }

    public static final class UserBuider {
        private Long id;

        private String username;

        private String email;

        private String passwordHash;

        private Role role;

        private String fullname;

        private Instant createAt;

        private Instant updateAt;

        public UserBuider id(Long id) {
            this.id = id;
            return this;
        }

        public UserBuider username(String username) {
            this.username = username;
            return this;
        }

        public UserBuider email(String email) {
            this.email = email;
            return this;
        }

        public UserBuider passwordHash(String passwordHash) {
            this.passwordHash = passwordHash;
            return this;
        }

        public UserBuider role(Role role) {
            this.role = role;
            return this;
        }

        public UserBuider fullname(String fullname) {
            this.fullname = fullname;
            return this;
        }

        public UserBuider createAt(Instant createAt) {
            this.createAt = createAt;
            return this;
        }

        public UserBuider updateAt(Instant updateAt) {
            this.updateAt = updateAt;
            return this;
        }

        public User build(User user) {
            //User user = new User();
            user.setId(id);
            user.setUsername(username);
            user.setEmail(email);
            user.setPasswordHash(passwordHash);
            user.setRole(role);
            user.setFullname(fullname);
            user.setCreateAt(createAt);
            user.setUpdateAt(updateAt);
            return user;
        }
    }
}
