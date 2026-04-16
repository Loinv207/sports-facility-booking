package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
public class UserProfile {

    @Id
    private String id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    public UserProfile(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public String getFirstName(){ return firstName; }
    public void setFirstName(String firstName){ this.firstName=firstName; }

    public String getLastName(){ return lastName; }
    public void setLastName(String lastName){ this.lastName=lastName; }

    public String getAvatarUrl(){ return avatarUrl; }
    public void setAvatarUrl(String avatarUrl){ this.avatarUrl=avatarUrl; }

    public LocalDate getDateOfBirth(){ return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth){ this.dateOfBirth=dateOfBirth; }
}