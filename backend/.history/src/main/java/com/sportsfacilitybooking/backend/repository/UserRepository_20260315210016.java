package com.sportsfacilitybooking.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ou.springcode.entity.Role;
import com.ou.springcode.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // Query derivation: phát sinh truy vấn dựa trên tên method
    // Dành cho method không có @Query
    //findByUsername
    // Cơ chế: Spring Data JPA sẽ đọc tên method, suy ra truy vấn tương ứng -> tự sinh ra Json, Sql
    // Quy ước tên:
    // findBy... -> Select, điều kiện theo thuộc tính sau "By"
    // existsBy... -> Kiểm tra tồn tại (Count/Exists)
    // ...AndIdNot -> thêm điều kiện AND id != :id
    // Không viết câu lệnh truy vấn, chỉ cần đặt tên method theo đúng quy tắc => Spring Data JPA sẽ implements giúp
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    // Tìm kiếm theo search (username hoặc email) và role
    // Ứng dụng ...
    @Query("SELECT u FROM User u WHERE " + 
    "(:search IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) " + 
    "AND (:role IS NULL OR u.role = :role)")
    Page<User>findAllBySearchAndRole(@Param("search") String search, @Param("role") Role role, Pageable pageable);
}