package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "fields")
Booking

package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    private String id;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    private String status;

    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Booking() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCheckedInAt() {
        return checkedInAt;
    }

    public void setCheckedInAt(LocalDateTime checkedInAt) {
        this.checkedInAt = checkedInAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

Commission

package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name="commissions")
public class Commission {

    @Id
    private String id;

    @Column(name="commission_rate")
    private BigDecimal commissionRate;

    @Column(name="commission_amount")
    private BigDecimal commissionAmount;

    public Commission(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public BigDecimal getCommissionRate(){ return commissionRate; }
    public void setCommissionRate(BigDecimal commissionRate){ this.commissionRate=commissionRate; }

    public BigDecimal getCommissionAmount(){ return commissionAmount; }
    public void setCommissionAmount(BigDecimal commissionAmount){ this.commissionAmount=commissionAmount; }
}


Field
package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "fields")
public class Field {

    @Id
    private String id;

    @Column(name = "field_name")
    private String fieldName;

    private String description;

    private String status;

    public Field() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}


FieldImage

package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name="field_images")
public class FieldImage {

    @Id
    private String id;

    @Column(name="image_url")
    private String imageUrl;

    public FieldImage(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public String getImageUrl(){ return imageUrl; }
    public void setImageUrl(String imageUrl){ this.imageUrl=imageUrl; }
}



FieldSchedule
package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name="field_schedule")
public class FieldSchedule {

    @Id
    private String id;

    @Column(name="field_id")
    private String fieldId;

    @Column(name="schedule_date")
    private LocalDate scheduleDate;

    @Column(name="start_time")
    private LocalTime startTime;

    @Column(name="end_time")
    private LocalTime endTime;

    private BigDecimal price;
    private String status;

    public FieldSchedule(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public String getFieldId(){ return fieldId; }
    public void setFieldId(String fieldId){ this.fieldId=fieldId; }

    public LocalDate getScheduleDate(){ return scheduleDate; }
    public void setScheduleDate(LocalDate scheduleDate){ this.scheduleDate=scheduleDate; }

    public LocalTime getStartTime(){ return startTime; }
    public void setStartTime(LocalTime startTime){ this.startTime=startTime; }

    public LocalTime getEndTime(){ return endTime; }
    public void setEndTime(LocalTime endTime){ this.endTime=endTime; }

    public BigDecimal getPrice(){ return price; }
    public void setPrice(BigDecimal price){ this.price=price; }

    public String getStatus(){ return status; }
    public void setStatus(String status){ this.status=status; }
}



Notification
package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="notifications")
public class Notification {

    @Id
    private String id;

    private String title;
    private String message;

    @Column(name="is_read")
    private Boolean isRead;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    public Notification(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public String getTitle(){ return title; }
    public void setTitle(String title){ this.title=title; }

    public String getMessage(){ return message; }
    public void setMessage(String message){ this.message=message; }

    public Boolean getIsRead(){ return isRead; }
    public void setIsRead(Boolean isRead){ this.isRead=isRead; }

    public LocalDateTime getCreatedAt(){ return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt=createdAt; }
}



Payment

package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="payments")
public class Payment {

    @Id
    private String id;

    private BigDecimal amount;

    @Column(name="payment_method")
    private String paymentMethod;

    @Column(name="payment_status")
    private String paymentStatus;

    @Column(name="transaction_id")
    private String transactionId;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    public Payment(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public BigDecimal getAmount(){ return amount; }
    public void setAmount(BigDecimal amount){ this.amount=amount; }

    public String getPaymentMethod(){ return paymentMethod; }
    public void setPaymentMethod(String paymentMethod){ this.paymentMethod=paymentMethod; }

    public String getPaymentStatus(){ return paymentStatus; }
    public void setPaymentStatus(String paymentStatus){ this.paymentStatus=paymentStatus; }

    public String getTransactionId(){ return transactionId; }
    public void setTransactionId(String transactionId){ this.transactionId=transactionId; }

    public LocalDateTime getCreatedAt(){ return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt=createdAt; }
}


Review

package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="reviews")
public class Review {

    @Id
    private String id;

    private Integer rating;
    private String comment;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    public Review(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public Integer getRating(){ return rating; }
    public void setRating(Integer rating){ this.rating=rating; }

    public String getComment(){ return comment; }
    public void setComment(String comment){ this.comment=comment; }

    public LocalDateTime getCreatedAt(){ return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt=createdAt; }
}


Role

package com.sportsfacilitybooking.backend.entity;

public enum Role {
    USER,
    ADMIN, 
    OWNER
}


SportsCenter

package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sports_centers")
public class SportsCenter {

    @Id
    private String id;

    private String name;

    private String address;

    private String city;

    @Column(name = "approval_status")
    private String approvalStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public SportsCenter() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

SportsType

package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "sports_types")
public class SportsType {

    @Id
    private Integer id;

    private String name;

    private String description;

    public SportsType() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}


SystemReport

package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="system_reports")
public class SystemReport {

    @Id
    private String id;

    @Column(name="report_type")
    private String reportType;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    public SystemReport(){}

    public String getId(){ return id; }
    public void setId(String id){ this.id=id; }

    public String getReportType(){ return reportType; }
    public void setReportType(String reportType){ this.reportType=reportType; }

    public LocalDateTime getCreatedAt(){ return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt=createdAt; }
}


User


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
}



UserProfile
package com.sportsfacilitybooking.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    private String id;

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


đây là các bảng trong entity của tôi. bạn coi thử đúng chưa, code đúng chưa, liên kết đồ đúng chưa 



public class Field {

    @Id
    private String id;

    @Column(name = "field_name")
    private String fieldName;

    @Column(name = "sports_type")
    private String sportsType;

    private String address;

    private String price;

    private String description;

    private String status;

    public Field() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getSportsType() {
        return sportsType;
    }

    public void setSportsType(String sportsType) {
        this.sportsType = sportsType;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}