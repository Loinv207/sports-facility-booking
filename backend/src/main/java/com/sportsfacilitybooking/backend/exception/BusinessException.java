package com.sportsfacilitybooking.backend.exception;

/**
 * Dùng cho các rule nghiệp vụ chung khi chưa có exception domain cụ thể.
 */
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
