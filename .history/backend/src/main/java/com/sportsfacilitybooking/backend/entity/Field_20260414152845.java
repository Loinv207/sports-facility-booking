// package com.sportsfacilitybooking.backend.entity;

// import jakarta.persistence.*;

// @Entity
// @Table(name = "fields")
// public class Field {

//     @Id
//     @GeneratedValue(strategy = GenerationType.UUID)
//     private String id;

//     @Column(name = "field_name")
//     private String fieldName;

//     // LIÊN KẾT: Một trung tâm có nhiều sân
//     @ManyToOne
//     @JoinColumn(name = "center_id")
//     private SportsCenter sportsCenter;


//     @Column(name = "sports_type")
//     private String sportsType;

//     private String address;

//     private String price;

//     private String description;

//     private String status;

//     public Field() {}

//     public String getId() {
//         return id;
//     }

//     public void setId(String id) {
//         this.id = id;
//     }

//     public String getFieldName() {
//         return fieldName;
//     }

//     public void setFieldName(String fieldName) {
//         this.fieldName = fieldName;
//     }

//     public String getSportsType() {
//         return sportsType;
//     }

//     public void setSportsType(String sportsType) {
//         this.sportsType = sportsType;
//     }

//     public String getAddress() {
//         return address;
//     }

//     public void setAddress(String address) {
//         this.address = address;
//     }

//     public String getPrice() {
//         return price;
//     }

//     public void setPrice(String price) {
//         this.price = price;
//     }

//     public String getDescription() {
//         return description;
//     }

//     public void setDescription(String description) {
//         this.description = description;
//     }

//     public String getStatus() {
//         return status;
//     }

//     public void setStatus(String status) {
//         this.status = status;
//     }
// }