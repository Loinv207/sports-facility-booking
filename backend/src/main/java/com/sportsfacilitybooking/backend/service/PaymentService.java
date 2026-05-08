package com.sportsfacilitybooking.backend.service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

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
    private String vnp_Url;

    @Value("${app.vnpay.return-url}")
    private String vnp_ReturnUrl;

    @Value("${app.vnpay.tmn-code:WCTEJ7O4}")
    private String vnp_TmnCode;

    @Value("${app.vnpay.hash-secret:35NQH0FH8QA5OJNVI8WGAJ8P60RXSEDA}")
    private String vnp_HashSecret;

    public PaymentService(BookingRepository bookingRepository, PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    public String createPaymentUrl(long amount, String bookingId, HttpServletRequest request) {
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", bookingId + "_" + System.currentTimeMillis());
        vnp_Params.put("vnp_OrderInfo", "Thanh toan dat coc booking " + bookingId);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", getIpAddress(request));

        TimeZone timeZone = TimeZone.getTimeZone("Asia/Ho_Chi_Minh");
        Calendar cld = Calendar.getInstance(timeZone);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(timeZone);
        vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));
        
        cld.add(Calendar.MINUTE, 15);
        vnp_Params.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                try {
                    // Build Hash: key=value (value must be encoded)
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                    // Build Query: key=value (both encoded)
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = hmacSHA512(vnp_HashSecret, hashData.toString());
        return vnp_Url + "?" + queryUrl + "&vnp_SecureHash=" + vnp_SecureHash;
    }

    @Transactional
    public String processCallback(Map<String, String> allParams) {
        if (!isValidSignature(allParams)) {
            throw new BusinessException("Chữ ký không hợp lệ từ VNPay");
        }

        String txnRef = allParams.get("vnp_TxnRef");
        String bookingId = txnRef.split("_")[0];

        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking: " + bookingId));

        Payment payment = paymentRepository.findByBookingId(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy payment"));

        String responseCode = allParams.get("vnp_ResponseCode");
        if ("00".equals(responseCode)) {
            booking.setStatus("PAID");
            payment.setPaymentStatus("PAID");
            payment.setTransactionId(allParams.get("vnp_TransactionNo"));
            paymentRepository.save(payment);
            bookingRepository.save(booking);
            return "Thanh toán thành công";
            
        } else {
            payment.setPaymentStatus("FAILED");
            paymentRepository.save(payment);
            return "Giao dịch thất bại: " + responseCode;
        }
    }

    private boolean isValidSignature(Map<String, String> allParams) {
        String receivedSecureHash = allParams.get("vnp_SecureHash");
        Map<String, String> filtered = new HashMap<>(allParams);
        filtered.remove("vnp_SecureHash");
        filtered.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(filtered.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String fieldValue = filtered.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (i < fieldNames.size() - 1) {
                    hashData.append('&');
                }
            }
        }
        return hmacSHA512(vnp_HashSecret, hashData.toString()).equalsIgnoreCase(receivedSecureHash);
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) sb.append(String.format("%02x", b & 0xff));
            return sb.toString();
        } catch (Exception ex) {
            return "";
        }
    }

    private String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-FORWARDED-FOR");
        return (ip == null || ip.isEmpty()) ? request.getRemoteAddr() : ip;
    }
}
