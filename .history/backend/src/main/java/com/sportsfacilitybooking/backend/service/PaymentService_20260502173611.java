package com.sportsfacilitybooking.backend.service;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportsfacilitybooking.backend.entity.Booking;
import com.sportsfacilitybooking.backend.entity.Payment;
import com.sportsfacilitybooking.backend.exception.BusinessException;
import com.sportsfacilitybooking.backend.exception.ResourceNotFoundException;
import com.sportsfacilitybooking.backend.repository.BookingRepository;
import com.sportsfacilitybooking.backend.repository.PaymentRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class PaymentService {
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @Value("${app.vnpay.pay-url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String payUrl;

    @Value("${app.vnpay.return-url:http://localhost:8080/api/payment/callback}")
    private String returnUrl;

    @Value("${app.vnpay.tmn-code:TCB04NCG}")
    private String tmnCode;

    @Value("${app.vnpay.hash-secret:UPNCOJTYWTMYALALVTMXWLZXALGPWJJW}")
    private String hashSecret;

    @Value("${app.vnpay.version:2.1.0}")
    private String version;

    @Value("${app.vnpay.command:pay}")
    private String command;

    public PaymentService(BookingRepository bookingRepository, PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    public String createPaymentUrl(long amount, String bookingId, HttpServletRequest request) {
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", "WCTEJ7O4"); // Dùng key mới của Lợi
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", bookingId + "_" + System.currentTimeMillis());
        vnp_Params.put("vnp_OrderInfo", "Thanh toan dat coc booking " + bookingId);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", returnUrl);
        vnp_Params.put("vnp_IpAddr", "127.0.0.1");

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));
        cld.add(Calendar.MINUTE, 15);
        vnp_Params.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        
        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Chuẩn 2.1.0: Encode cả key và value cho URL, nhưng hashData thì tùy chỉnh
                try {
    String k = URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()).replace("+", "%20");
    String v = URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()).replace("+", "%20");
    // ... các dòng append code tiếp theo
} catch (UnsupportedEncodingException e) {
    e.printStackTrace();
}

                query.append(k).append('=').append(v);
                hashData.append(fieldName).append('=').append(v); // Key để nguyên, Value encode

                if (i < fieldNames.size() - 1) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String vnp_SecureHash = hmacSHA512("35NQH0FH8QA5OJNVI8WGAJ8P60RXSEDA", hashData.toString());
        return "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?" + query.toString() + "&vnp_SecureHash=" + vnp_SecureHash;
    }

    @Transactional
    public String processCallback(Map<String, String> allParams) {
        if (!isValidSignature(allParams)) {
            throw new BusinessException("Chu ky khong hop le tu VNPay");
        }

        String txnRef = allParams.get("vnp_TxnRef");
        if (txnRef == null || txnRef.isBlank()) {
            throw new BusinessException("Thieu ma giao dich vnp_TxnRef");
        }

        String[] parts = txnRef.split("_", 2);
        String bookingId = parts[0];

        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay booking: " + bookingId));

        Payment payment = paymentRepository.findByBookingId(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay payment cho booking: " + bookingId));

        String responseCode = allParams.get("vnp_ResponseCode");
        String transactionStatus = allParams.get("vnp_TransactionStatus");
        String transactionNo = allParams.get("vnp_TransactionNo");

        if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
            if (!"PAID".equalsIgnoreCase(payment.getPaymentStatus())) {
                booking.setStatus("PAID");
                payment.setPaymentStatus("PAID");
                payment.setTransactionId(transactionNo != null ? transactionNo : txnRef);
                paymentRepository.save(payment);
                bookingRepository.save(booking);
            }
            return "Thanh toan thanh cong";
        }

        if (!"PAID".equalsIgnoreCase(payment.getPaymentStatus())) {
            payment.setPaymentStatus("FAILED");
            payment.setTransactionId(transactionNo != null ? transactionNo : txnRef);
            paymentRepository.save(payment);
        }
        return "Giao dich that bai. ResponseCode=" + responseCode + ", TransactionStatus=" + transactionStatus;
    }

    private boolean isValidSignature(Map<String, String> allParams) {
        String receivedSecureHash = allParams.get("vnp_SecureHash");
        if (receivedSecureHash == null || receivedSecureHash.isBlank()) {
            return false;
        }

        Map<String, String> filtered = new HashMap<>(allParams);
        filtered.remove("vnp_SecureHash");
        filtered.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(filtered.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();

        boolean first = true;
        // for (String fieldName : fieldNames) {
        //     String fieldValue = filtered.get(fieldName);
        //     if (fieldValue == null || fieldValue.isEmpty()) {
        //         continue;
        //     }
        //     if (!first) {
        //         hashData.append('&');
        //     }
        //     hashData.append(fieldName)
        //         .append('=')
        //         .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
        //     first = false;
        // }
        for (String fieldName : fieldNames) {
            String fieldValue = filtered.get(fieldName);
            if (fieldValue == null || fieldValue.isEmpty()) continue;
            
            if (!first) hashData.append('&');
            
            // Đảm bảo đồng nhất cách băm dữ liệu
            String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII).replace("+", "%20");
            
            hashData.append(fieldName).append('=').append(encodedValue);
            first = false;
        }

        String calculated = hmacSHA512(hashSecret, hashData.toString());
        return calculated.equalsIgnoreCase(receivedSecureHash);
    }

    private String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception ex) {
            throw new BusinessException("Khong the tao chu ky VNPay");
        }
    }

    private String getIpAddress(HttpServletRequest request) {
        String ipAdress;
        try {
            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress == null || ipAdress.isBlank()) {
                ipAdress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAdress = "127.0.0.1";
        }
        return ipAdress;
    }
}
