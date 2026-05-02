package com.sportsfacilitybooking.backend.controller;

import com.sportsfacilitybooking.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // API 1: Tạo URL (Front-end gọi cái này khi nhấn "Thanh toán")
    @PostMapping("/vnpay")
    public ResponseEntity<?> createPayment(
            @RequestParam long amount, 
            @RequestParam String bookingId, 
            HttpServletRequest request) {
        String paymentUrl = paymentService.createPaymentUrl(amount, bookingId, request);
        return ResponseEntity.ok(paymentUrl);
    }

    // API 2: Xử lý kết quả trả về
    @GetMapping("/callback")
    public ResponseEntity<?> paymentCallback(@RequestParam Map<String, String> allParams) {
        String responseCode = allParams.get("vnp_ResponseCode");
        String bookingInfo = allParams.get("vnp_OrderInfo");
        
        if ("00".equals(responseCode)) {
            // TODO: Lợi viết thêm logic cập nhật Database tại đây
            // Ví dụ: bookingRepository.updateStatus("PAID", bookingId);
            return ResponseEntity.ok("Thanh toán thành công cho: " + bookingInfo);
        } else {
            return ResponseEntity.badRequest().body("Thanh toán thất bại. Mã lỗi: " + responseCode);
        }
    }
}