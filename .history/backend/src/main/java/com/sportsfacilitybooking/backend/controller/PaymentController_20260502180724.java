// package com.sportsfacilitybooking.backend.controller;

// import com.sportsfacilitybooking.backend.entity.Booking;
// import com.sportsfacilitybooking.backend.entity.Payment;
// import com.sportsfacilitybooking.backend.repository.BookingRepository;
// import com.sportsfacilitybooking.backend.repository.PaymentRepository;
// import com.sportsfacilitybooking.backend.service.PaymentService;
// import jakarta.servlet.http.HttpServletRequest;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.HashMap;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/payment")
// public class PaymentController {

//     @Autowired
//     private PaymentService paymentService;

//     @Autowired
//     private BookingRepository bookingRepository;

//     @Autowired
//     private PaymentRepository paymentRepository;

//     /**
//      * API: Tạo URL Thanh toán VNPay cho đơn đặt sân
//      * Luồng: Kiểm tra đơn hàng -> Lấy số tiền cọc (depositAmount) -> Tạo URL
//      */
//     @PostMapping("/vnpay")
//     public ResponseEntity<?> createPayment(
//             @RequestParam String bookingId, 
//             HttpServletRequest request) {
        
//         // 1. Tìm Booking theo ID kiểu String từ Repository
//         Booking booking = bookingRepository.findById(bookingId)
//                 .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt sân mã: " + bookingId));

//         // 2. Kiểm tra trạng thái đơn hàng (Chỉ cho phép thanh toán nếu đang PENDING)
//         Payment payment = paymentRepository.findByBookingId(bookingId)
//             .orElseThrow(() -> new RuntimeException("Khong tim thay thong tin payment cua booking: " + bookingId));

//         if ("PAID".equalsIgnoreCase(booking.getStatus()) || "PAID".equalsIgnoreCase(payment.getPaymentStatus())) {
//             return ResponseEntity.badRequest().body("Đơn hàng này đã được thanh toán trước đó.");
//         }

//         // 3. Lấy số tiền cần thanh toán
//         // Theo Entity của bạn, ta nên dùng depositAmount (số tiền cọc) hoặc totalPrice.
//         // Ở đây tôi dùng depositAmount để thực hiện đúng logic "Đặt cọc".
//         if (booking.getDepositAmount() == null) {
//             return ResponseEntity.badRequest().body("Đơn hàng không có thông tin số tiền cọc.");
//         }

//         // Chuyển BigDecimal sang long (VNPay yêu cầu đơn vị là VNĐ số nguyên)
//         long amount = booking.getDepositAmount().longValue(); 

//         // 4. Tạo URL thanh toán
//         String paymentUrl = paymentService.createPaymentUrl(amount, bookingId, request);
        
//         Map<String, String> result = new HashMap<>();
//         result.put("bookingId", bookingId);
//         result.put("paymentUrl", paymentUrl);
//         return ResponseEntity.ok(result);
//     }

//     /**
//      * API: Nhận kết quả từ VNPay
//      */
//     @GetMapping("/callback")
//     public ResponseEntity<?> paymentCallback(@RequestParam Map<String, String> allParams) {
//         String message = paymentService.processCallback(allParams);
//         return ResponseEntity.ok(message);
//     }
// }




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

import java.io.IOException;
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

    /**
     * API: Tạo URL Thanh toán VNPay cho đơn đặt sân
     */
    @PostMapping("/vnpay")
    public ResponseEntity<?> createPayment(
            @RequestParam String bookingId, 
            HttpServletRequest request) {
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt sân mã: " + bookingId));

        Payment payment = paymentRepository.findByBookingId(bookingId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin payment của booking: " + bookingId));

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

    /**
     * API: Nhận kết quả từ VNPay và Redirect về React
     * Thay đổi: Dùng HttpServletResponse để tự động chuyển hướng trang
     */
    @GetMapping("/callback")
    public void paymentCallback(@RequestParam Map<String, String> allParams, HttpServletResponse response) throws IOException {
        // 1. Gọi service xử lý logic cập nhật DB
        String message = paymentService.processCallback(allParams);

        // 2. Tách lấy bookingId từ tham số vnp_TxnRef (định dạng: bookingId_timestamp)
        String txnRef = allParams.get("vnp_TxnRef");
        String bookingId = (txnRef != null && txnRef.contains("_")) ? txnRef.split("_")[0] : txnRef;

        // 3. Điều hướng về Frontend React
        if (message.contains("Thanh toan thanh cong")) {
            // Trả về trang thành công kèm mã bookingId
            response.sendRedirect("http://localhost:5173/payment-success?status=success&bookingId=" + bookingId);
        } else {
            // Trả về trang thất bại
            response.sendRedirect("http://localhost:5173/payment-success?status=failed&bookingId=" + bookingId);
        }
    }
}