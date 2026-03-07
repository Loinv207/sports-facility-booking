1. Overview

This document describes the database design of the Sports Field Booking Platform.
The system allows customers to search for sports fields, view available schedules, book fields, make deposits, and leave reviews. Field owners can manage their fields and booking schedules, while administrators manage the system and approve new sports centers.

2. Database Diagram

<img width="758" height="873" alt="Screenshot 2026-03-08 012729" src="https://github.com/user-attachments/assets/a9d9fb9b-f200-47f9-a457-cee031f3915c" />

3. Database Tables
3.1 Users

Stores account information of all users in the system.
| Column        | Type         | Description                               |
| ------------- | ------------ | ----------------------------------------- |
| id            | CHAR(36)     | Unique identifier of the user             |
| username      | VARCHAR(50)  | Username used for login                   |
| email         | VARCHAR(100) | User email address                        |
| password_hash | VARCHAR(255) | Encrypted user password                   |
| phone_number  | VARCHAR(20)  | User phone number                         |
| role          | ENUM         | Role of the user (customer, owner, admin) |
| status        | ENUM         | Account status (active, banned)           |
| created_at    | TIMESTAMP    | Time when account was created             |



3.2 User_Profiles

Stores additional profile information of users.
| Column        | Type         | Description                 |
| ------------- | ------------ | --------------------------- |
| id            | CHAR(36)     | Unique profile identifier   |
| user_id       | CHAR(36)     | Reference to the user       |
| first_name    | VARCHAR(50)  | User first name             |
| last_name     | VARCHAR(50)  | User last name              |
| avatar_url    | VARCHAR(255) | URL of user's profile image |
| date_of_birth | DATE         | User's date of birth        |

3.3 Sports_Types

Stores different types of sports.

| Column      | Type         | Description                                      |
| ----------- | ------------ | ------------------------------------------------ |
| id          | INT          | Unique sport type identifier                     |
| name        | VARCHAR(100) | Name of sport type (football, badminton, tennis) |
| description | TEXT         | Description of the sport type                    |


3.4 Sports_Centers

Stores information about sports centers.

| Column          | Type         | Description                                   |
| --------------- | ------------ | --------------------------------------------- |
| id              | CHAR(36)     | Unique sports center identifier               |
| name            | VARCHAR(255) | Name of the sports center                     |
| address         | VARCHAR(255) | Address of the sports center                  |
| city            | VARCHAR(100) | City location                                 |
| owner_id        | CHAR(36)     | Owner of the sports center                    |
| approval_status | ENUM         | Approval status (pending, approved, rejected) |
| created_at      | TIMESTAMP    | Creation timestamp                            |

3.5 Fields

Stores information about each sports field.
| Column        | Type         | Description                              |
| ------------- | ------------ | ---------------------------------------- |
| id            | CHAR(36)     | Unique field identifier                  |
| center_id     | CHAR(36)     | Sports center where the field is located |
| sport_type_id | INT          | Type of sport played on the field        |
| field_name    | VARCHAR(100) | Name of the field                        |
| description   | TEXT         | Description of the field                 |
| status        | ENUM         | Field status (available, maintenance)    |

3.6 Field_Images

Stores images of sports fields.
| Column    | Type         | Description             |
| --------- | ------------ | ----------------------- |
| id        | CHAR(36)     | Unique image identifier |
| field_id  | CHAR(36)     | Reference to the field  |
| image_url | VARCHAR(255) | URL of the field image  |

3.7 Field_Schedule

Stores available time slots for fields.

| Column        | Type     | Description                     |
| ------------- | -------- | ------------------------------- |
| id            | CHAR(36) | Unique schedule identifier      |
| field_id      | CHAR(36) | Reference to the field          |
| schedule_date | DATE     | Date of the schedule            |
| start_time    | TIME     | Start time of the slot          |
| end_time      | TIME     | End time of the slot            |
| price         | DECIMAL  | Price for the time slot         |
| status        | ENUM     | Slot status (available, booked) |

3.8 Bookings

Stores booking information created by users.
| Column        | Type      | Description                                               |
| ------------- | --------- | --------------------------------------------------------- |
| id            | CHAR(36)  | Unique booking identifier                                 |
| user_id       | CHAR(36)  | User who created the booking                              |
| field_id      | CHAR(36)  | Booked field                                              |
| schedule_id   | CHAR(36)  | Selected schedule                                         |
| booking_date  | DATE      | Booking date                                              |
| total_price   | DECIMAL   | Total booking price                                       |
| status        | ENUM      | Booking status (pending, confirmed, cancelled, completed) |
| checked_in_at | TIMESTAMP | Time when customer checks in                              |
| created_at    | TIMESTAMP | Booking creation time                                     |

3.9 Payments

Stores payment transactions.

| Column         | Type         | Description                               |
| -------------- | ------------ | ----------------------------------------- |
| id             | CHAR(36)     | Payment identifier                        |
| booking_id     | CHAR(36)     | Related booking                           |
| amount         | DECIMAL      | Payment amount                            |
| payment_method | VARCHAR(50)  | Payment method (card, momo, etc.)         |
| payment_status | ENUM         | Payment status (pending, success, failed) |
| transaction_id | VARCHAR(255) | Payment gateway transaction ID            |
| created_at     | TIMESTAMP    | Payment time                              |

3.10 Commissions

Stores system commission for each booking.
| Column            | Type     | Description                          |
| ----------------- | -------- | ------------------------------------ |
| id                | CHAR(36) | Commission identifier                |
| booking_id        | CHAR(36) | Related booking                      |
| commission_rate   | DECIMAL  | Commission percentage                |
| commission_amount | DECIMAL  | Amount of commission taken by system |

3.11 Reviews

Stores user reviews for sports fields.
| Column     | Type      | Description                  |
| ---------- | --------- | ---------------------------- |
| id         | CHAR(36)  | Review identifier            |
| user_id    | CHAR(36)  | User who wrote the review    |
| field_id   | CHAR(36)  | Reviewed field               |
| rating     | INT       | Rating score (1–5)           |
| comment    | TEXT      | Review content               |
| created_at | TIMESTAMP | Time when review was created |

3.12 Notifications

Stores notifications sent to users.
| Column     | Type         | Description                                  |
| ---------- | ------------ | -------------------------------------------- |
| id         | CHAR(36)     | Notification identifier                      |
| user_id    | CHAR(36)     | User receiving the notification              |
| title      | VARCHAR(255) | Notification title                           |
| message    | TEXT         | Notification message                         |
| is_read    | BOOLEAN      | Indicates whether notification has been read |
| created_at | TIMESTAMP    | Notification creation time                   |

3.13 System_Reports

Stores generated system reports.
| Column       | Type        | Description                        |
| ------------ | ----------- | ---------------------------------- |
| id           | CHAR(36)    | Report identifier                  |
| report_type  | VARCHAR(50) | Type of report (revenue, bookings) |
| generated_by | CHAR(36)    | Admin who generated the report     |
| created_at   | TIMESTAMP   | Report creation time               |
