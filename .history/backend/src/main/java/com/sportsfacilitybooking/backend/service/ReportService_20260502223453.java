// package com.sportsfacilitybooking.backend.service;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import com.sportsfacilitybooking.backend.dto.SystemSummaryResponse;
// import com.sportsfacilitybooking.backend.dto.FinanceReportResponse; 
// import com.sportsfacilitybooking.backend.repository.SystemReportRepository;
// import com.sportsfacilitybooking.backend.repository.BookingRepository; 
// import com.sportsfacilitybooking.backend.entity.Booking;
// import java.math.BigDecimal;
// import java.math.RoundingMode;
// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;

// @Service
// public class ReportService {
//     @Autowired
//     private SystemReportRepository reportRepository;

//     @Autowired
//     private BookingRepository bookingRepository; // lọc đơn hàng PAID

//     @Autowired
//     private CommissionService commissionService; // lấy tỷ lệ % hoa hồng

//     // public SystemSummaryResponse getSystemSummary() {
//     //     Double revenue = reportRepository.sumAllRevenue();
//     //     Long bookings = reportRepository.sumAllBookings();
        
//     //     return new SystemSummaryResponse(
//     //         revenue != null ? revenue : 0.0, 
//     //         bookings != null ? bookings : 0L
//     //     );
//     // }

//     public SystemSummaryResponse getSystemSummary() {
//     // Thay vì dùng reportRepository.sumAllRevenue() (có thể tính cả đơn chưa thanh toán)
//     // Hãy dùng chung logic với Finance Report để số liệu khớp nhau
//         List<Booking> paidBookings = bookingRepository.findByStatusIn(List.of("PAID", "COMPLETED"));
        
//         BigDecimal revenue = paidBookings.stream()
//                 .map(Booking::getTotalPrice)
//                 .reduce(BigDecimal.ZERO, BigDecimal::add);
                
//         return new SystemSummaryResponse(
//             revenue.doubleValue(), 
//             (long) paidBookings.size()
//         );
//     }


//     // Báo cáo tài chính chi tiết
//     public FinanceReportResponse getFinanceReport() {
//         // Lấy danh sách đơn hàng đã thanh toán thực tế
//         List<Booking> paidBookings = bookingRepository.findByStatusIn(List.of("PAID", "COMPLETED"));

//         // Tính tổng doanh thu
//         BigDecimal totalRevenue = paidBookings.stream()
//                 .map(Booking::getTotalPrice)
//                 .reduce(BigDecimal.ZERO, BigDecimal::add);

//         // Lấy tỷ lệ hoa hồng từ CommissionService bạn đã làm
//         BigDecimal rate = commissionService.getSystemCommission().getCommissionRate();
        
//         // Tính toán: Hoa hồng = Doanh thu * (Tỷ lệ / 100)
//         BigDecimal totalCommission = totalRevenue.multiply(rate)
//                 .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        
//         // Thực nhận = Doanh thu - Hoa hồng
//         BigDecimal netAmount = totalRevenue.subtract(totalCommission);

//         return new FinanceReportResponse(
//                 totalRevenue, 
//                 totalCommission, 
//                 netAmount, 
//                 (long) paidBookings.size()
//         );
//     }

//     public List<Map<String, Object>> getMonthlyStatistics() {
//         // 1. Lấy tất cả đơn đã thanh toán trong năm nay
//         List<Booking> paidBookings = bookingRepository.findByStatusIn(List.of("PAID", "COMPLETED"));

//         // 2. Nhóm theo tháng và tính tổng doanh thu/số lượng đơn
//         // Kết quả trung gian: Map<Tháng, List<Booking>>
//         Map<Integer, List<Booking>> bookingsByMonth = paidBookings.stream()
//                 .collect(Collectors.groupingBy(b -> b.getBookingDate().getMonthValue()));

//         List<Map<String, Object>> monthlyData = new ArrayList<>();

//         // 3. Duyệt qua 12 tháng để đảm bảo tháng nào không có khách vẫn hiện số 0 (không bị trống biểu đồ)
//         for (int i = 1; i <= 12; i++) {
//             List<Booking> monthBookings = bookingsByMonth.getOrDefault(i, new ArrayList<>());
            
//             BigDecimal monthlyRevenue = monthBookings.stream()
//                     .map(Booking::getTotalPrice)
//                     .reduce(BigDecimal.ZERO, BigDecimal::add);

//             Map<String, Object> stats = new HashMap<>();
//             stats.put("name", "Tháng " + i);
//             stats.put("revenue", monthlyRevenue);
//             stats.put("bookings", (long) monthBookings.size());
            
//             monthlyData.add(stats);
//         }

//         return monthlyData;
//     }    
// }





package com.sportsfacilitybooking.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sportsfacilitybooking.backend.dto.SystemSummaryResponse;
import com.sportsfacilitybooking.backend.dto.FinanceReportResponse; 
import com.sportsfacilitybooking.backend.repository.SystemReportRepository;
import com.sportsfacilitybooking.backend.repository.BookingRepository;
import com.sportsfacilitybooking.backend.repository.UserRepository; // Thêm mới
import com.sportsfacilitybooking.backend.repository.FieldRepository; // Thêm mới
import com.sportsfacilitybooking.backend.entity.Booking;
import com.sportsfacilitybooking.backend.entity.User;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {
    @Autowired
    private SystemReportRepository reportRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository; // Tiêm vào để đếm user mới

    @Autowired
    private FieldRepository fieldRepository; // Tiêm vào để tính công suất sân

    @Autowired
    private CommissionService commissionService;

    public SystemSummaryResponse getSystemSummary() {
        // 1. Lấy danh sách đơn hàng đã thanh toán
        List<Booking> paidBookings = bookingRepository.findByStatusIn(List.of("PAID", "COMPLETED"));
        
        // 2. Tính doanh thu
        BigDecimal revenue = paidBookings.stream()
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Tính số người dùng mới trong tháng hiện tại
        LocalDate now = LocalDate.now();
        long newUsers = userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null && 
                        u.getCreatedAt().getMonthValue() == now.getMonthValue() &&
                        u.getCreatedAt().getYear() == now.getYear())
                .count();

        // 4. Tính tỉ lệ lấp đầy (Occupancy Rate)
        // Giả định: Mỗi ngày mỗi sân hoạt động 10 tiếng.
        long totalFields = fieldRepository.count();
        int daysInMonth = now.lengthOfMonth();
        double totalCapacityHours = totalFields * 10 * daysInMonth;

        // Tính số giờ đã được đặt trong tháng này (giả định mỗi booking trung bình 1 giờ)
        long bookedInMonth = paidBookings.stream()
                .filter(b -> b.getBookingDate().getMonthValue() == now.getMonthValue() &&
                             b.getBookingDate().getYear() == now.getYear())
                .count();

        double occupancyRate = (totalCapacityHours > 0) ? ((double) bookedInMonth / totalCapacityHours) * 100 : 0;

        // Trả về DTO (Lợi nhớ cập nhật Constructor của SystemSummaryResponse nhé)
        return new SystemSummaryResponse(
            revenue.doubleValue(), 
            (long) paidBookings.size(),
            newUsers,
            Math.round(occupancyRate * 10.0) / 10.0 // Làm tròn 1 chữ số thập phân
        );
    }

    public FinanceReportResponse getFinanceReport() {
        List<Booking> paidBookings = bookingRepository.findByStatusIn(List.of("PAID", "COMPLETED"));

        BigDecimal totalRevenue = paidBookings.stream()
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal rate = commissionService.getSystemCommission().getCommissionRate();
        
        BigDecimal totalCommission = totalRevenue.multiply(rate)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        
        BigDecimal netAmount = totalRevenue.subtract(totalCommission);

        return new FinanceReportResponse(
                totalRevenue, 
                totalCommission, 
                netAmount, 
                (long) paidBookings.size()
        );
    }

    public List<Map<String, Object>> getMonthlyStatistics() {
        List<Booking> paidBookings = bookingRepository.findByStatusIn(List.of("PAID", "COMPLETED"));
        LocalDate now = LocalDate.now();

        // Chỉ lọc các đơn trong năm hiện tại để biểu đồ chính xác
        Map<Integer, List<Booking>> bookingsByMonth = paidBookings.stream()
                .filter(b -> b.getBookingDate().getYear() == now.getYear())
                .collect(Collectors.groupingBy(b -> b.getBookingDate().getMonthValue()));

        List<Map<String, Object>> monthlyData = new ArrayList<>();

        for (int i = 1; i <= 12; i++) {
            List<Booking> monthBookings = bookingsByMonth.getOrDefault(i, new ArrayList<>());
            
            BigDecimal monthlyRevenue = monthBookings.stream()
                    .map(Booking::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> stats = new HashMap<>();
            stats.put("name", "Tháng " + i);
            stats.put("revenue", monthlyRevenue);
            stats.put("bookings", (long) monthBookings.size());
            
            monthlyData.add(stats);
        }

        return monthlyData;
    }    
}