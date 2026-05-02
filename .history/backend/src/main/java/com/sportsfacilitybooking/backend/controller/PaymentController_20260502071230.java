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
     * API: Tạo URL Thanh toán VNPay cho đơn đặt sân
     * Luồng: Kiểm tra đơn hàng -> Lấy số tiền cọc (depositAmount) -> Tạo URL
     */
    @PostMapping("/vnpay")
    public ResponseEntity<?> createPayment(
            @RequestParam String bookingId, 
            HttpServletRequest request) {
        
        // 1. Tìm Booking theo ID kiểu String từ Repository
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt sân mã: " + bookingId));

        // 2. Kiểm tra trạng thái đơn hàng (Chỉ cho phép thanh toán nếu đang PENDING)
        if ("PAID".equalsIgnoreCase(booking.getStatus())) {
            return ResponseEntity.badRequest().body("Đơn hàng này đã được thanh toán trước đó.");
        }

        // 3. Lấy số tiền cần thanh toán
        // Theo Entity của bạn, ta nên dùng depositAmount (số tiền cọc) hoặc totalPrice.
        // Ở đây tôi dùng depositAmount để thực hiện đúng logic "Đặt cọc".
        if (booking.getDepositAmount() == null) {
            return ResponseEntity.badRequest().body("Đơn hàng không có thông tin số tiền cọc.");
        }

        // Chuyển BigDecimal sang long (VNPay yêu cầu đơn vị là VNĐ số nguyên)
        long amount = booking.getDepositAmount().longValue(); 

        // 4. Tạo URL thanh toán
        String paymentUrl = paymentService.createPaymentUrl(amount, bookingId, request);
        
        return ResponseEntity.ok(paymentUrl);
    }

    /**
     * API: Nhận kết quả từ VNPay
     */
    @GetMapping("/callback")
    public ResponseEntity<?> paymentCallback(@RequestParam Map<String, String> allParams) {
        String responseCode = allParams.get("vnp_ResponseCode");
        
        // Tách bookingId từ TxnRef (bookingId_timestamp)
        String vnp_TxnRef = allParams.get("vnp_TxnRef");
        String bookingId = vnp_TxnRef.split("_")[0];

        if ("00".equals(responseCode)) {
            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            
            if (booking != null) {
                // Cập nhật trạng thái thành PAID
                booking.setStatus("PAID");
                
                // Bạn có thể lưu thêm thông tin thời điểm thanh toán nếu cần
                // booking.setNote("Đã thanh toán qua VNPay lúc: " + LocalDateTime.now());
                
                bookingRepository.save(booking);
                
                return ResponseEntity.ok("Thanh toán thành công. Đơn hàng " + bookingId + " đã cập nhật trạng thái PAID.");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Thanh toán thành công nhưng đơn hàng không tồn tại.");
        } else {
            // Trường hợp người dùng hủy thanh toán hoặc lỗi thẻ
            return ResponseEntity.badRequest().body("Giao dịch không thành công. Mã lỗi từ VNPay: " + responseCode);
        }
    }
}