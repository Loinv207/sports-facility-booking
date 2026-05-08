package com.sportsfacilitybooking.backend.controller;

import com.sportsfacilitybooking.backend.entity.Booking;
import com.sportsfacilitybooking.backend.entity.Payment;
import com.sportsfacilitybooking.backend.repository.BookingRepository;
import com.sportsfacilitybooking.backend.repository.PaymentRepository;
import com.sportsfacilitybooking.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping("/vnpay")
    public ResponseEntity<?> createPayment(
            @RequestParam String bookingId, 
            HttpServletRequest request) {
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt sân mã: " + bookingId));

        Payment payment = paymentRepository.findByBookingId(bookingId)
            .orElseThrow(() -> new RuntimeException("Khong tim thay thong tin payment cua booking: " + bookingId));

        if ("PAID".equalsIgnoreCase(booking.getStatus()) || "PAID".equalsIgnoreCase(payment.getPaymentStatus())) {
            return ResponseEntity.badRequest().body("Đơn hàng này đã được thanh toán trước đó.");
        }

        if (booking.getDepositAmount() == null) {
            return ResponseEntity.badRequest().body("Đơn hàng không có thông tin số tiền cọc.");
        }

        long amount = booking.getDepositAmount().longValue(); 

        String paymentUrl = paymentService.createPaymentUrl(amount, bookingId, request);
        
        Map<String, String> result = new HashMap<>();
        result.put("bookingId", bookingId);
        result.put("paymentUrl", paymentUrl);
        return ResponseEntity.ok(result);
    }

    // @GetMapping("/callback")
    // public ResponseEntity<?> paymentCallback(@RequestParam Map<String, String> allParams) {
    //     String message = paymentService.processCallback(allParams);
    //     return ResponseEntity.ok(message);
    // }

    @GetMapping("/callback")
    public void paymentCallback(@RequestParam Map<String, String> allParams, HttpServletResponse response) throws IOException {
    
        String result = paymentService.processCallback(allParams);
        
        
        String status = result.contains("thành công") ? "success" : "failed";
        
   
        String bookingId = allParams.get("vnp_TxnRef").split("_")[0];
        String amount = allParams.get("vnp_Amount");

        
        String redirectUrl = String.format("http://localhost:5173/payment-result?status=%s&bookingId=%s&amount=%s", 
                                            status, bookingId, amount);

       
        response.sendRedirect(redirectUrl);
    }
}
