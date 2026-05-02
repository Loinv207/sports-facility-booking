package com.sportsfacilitybooking.backend.controller;

import com.sportsfacilitybooking.backend.entity.Booking;
import com.sportsfacilitybooking.backend.repository.BookingRepository;
import com.sportsfacilitybooking.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private BookingRepository bookingRepository;

    /**
     * API: Tạo URL Thanh toán qua VNPay
     * Frontend gọi: POST /api/payment/vnpay?bookingId=...
     */
    @PostMapping("/vnpay")
    public ResponseEntity<?> createPayment(
            @RequestParam String bookingId, 
            HttpServletRequest request) {
        
        // 1. Kiểm tra Booking tồn tại trong Database thông qua Repository
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt sân mã: " + bookingId));

        // 2. Lấy số tiền cần thanh toán
        // Giả sử biến lưu giá tiền trong Entity Booking của bạn là totalPrice
        long amount = (long) booking.getTotalPrice(); 

        // 3. Gọi PaymentService để tạo chuỗi URL thanh toán VNPay
        String paymentUrl = paymentService.createPaymentUrl(amount, bookingId, request);
        
        return ResponseEntity.ok(paymentUrl);
    }

    /**
     * API: Xử lý kết quả trả về từ VNPay (Callback)
     * VNPay sẽ gọi về URL này sau khi người dùng thao tác xong
     */
    @GetMapping("/callback")
    public ResponseEntity<?> paymentCallback(@RequestParam Map<String, String> allParams) {
        String responseCode = allParams.get("vnp_ResponseCode");
        
        // vnp_TxnRef được định nghĩa trong PaymentService là bookingId_timestamp
        String vnp_TxnRef = allParams.get("vnp_TxnRef");
        String bookingId = vnp_TxnRef.split("_")[0]; // Lấy lại bookingId từ chuỗi giao dịch

        // Mã "00" nghĩa là thanh toán thành công tại VNPay
        if ("00".equals(responseCode)) {
            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            
            if (booking != null) {
                // Cập nhật trạng thái đơn hàng sang PAID
                booking.setStatus("PAID"); 
                bookingRepository.save(booking);
                
                return ResponseEntity.ok("Thanh toán thành công. Đơn hàng " + bookingId + " đã được xác nhận.");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Thanh toán thành công nhưng không tìm thấy dữ liệu đơn hàng.");
        } else {
            return ResponseEntity.badRequest()
                .body("Giao dịch không thành công. Mã lỗi: " + responseCode);
        }
    }
}