# Báo cáo Tuần 8
**Tuần:** 8 (20/04/2026 - 26/04/2026)

**Nhóm:** 3

**Đề tài:** 2 - Đặt Sân Thể Thao

**Nhóm trưởng:** Nguyễn Vinh Lợi - 2251052061
---
## 1. Công việc đã hoàn thành
| Thành viên      | MSSV       | Công việc                                                              | Link Commit/PR |
|-----------------|------------|------------------------------------------------------------------------|----------------|
| **Nguyễn Vinh Lợi** | 2251052061 | **Backend:** <br>API GET /api/admin/users: Liệt kê danh sách tất cả người dùng kèm Role và UserProfile<br>API PUT /api/admin/users/{id}/status: Khóa/Mở khóa tài khoản người dùng <br>API GET /api/admin/reports/system: Tổng hợp dữ liệu từ bảng SystemReport để lấy doanh thu và số lượng Booking <br>API POST /api/notifications: Tạo thông báo mới gửi đến người dùng (Table Notification). <br>**Frontend:** <br>Dựng Admin Dashboard: Hiển thị biểu đồ tăng trưởng User và Doanh thu (sử dụng Chart.js) <br>Trang User Management: Giao diện quản lý danh sách thành viên chuyên nghiệp <br>Module Security: Hoàn thiện bộ lọc JWT để phân quyền chính xác: Admin, Owner, User|[29b07dc](https://github.com/Loinv207/sports-facility-booking/pull/20/changes/29b07dc9563fae579e5f713b30655ad9a1b43851)|
| **Lê Hồng Đức**     | 2251052021 | **Backend:** <br>API POST /api/owner/fields/{id}/images: API upload và lưu link ảnh vào bảng FieldImage <br>API DELETE /api/owner/fields/images/{imageId}: Xóa ảnh sân <br>API GET /api/owner/fields/{id}/schedules: Lấy danh sách khung giờ và giá tiền từ bảng FieldSchedule <br>API POST /api/owner/fields/{id}/schedules/bulk: Tạo hàng loạt khung giờ cho sân <br>API PUT /api/owner/centers/{id}: Cập nhật thông tin trung tâm thể thao (Table SportsCenter) <br>**Frontend:** <br>Nâng cấp Owner Management: Thêm tính năng upload đa ảnh và quản lý thư viện ảnh sân <br>Dựng giao diện Schedule Manager: Bảng quản lý giờ giấc (Time-slot) trực quan cho chủ sân|[d88c401](https://github.com/Loinv207/sports-facility-booking/pull/19/changes/d88c40195db5ca5d662815cb4be2df9befd29495)|
| **Hồ Ngọc Minh**    | 2251012092 | **Backend:** <br>API GET /api/fields/search: API tìm kiếm cực mạnh. Lọc theo SportsType, address, khoảng giá, và rating <br>API GET /api/fields/{id}/full-details: Lấy toàn bộ thông tin từ Field, FieldImage, FieldSchedule, và SportsCenter <br>API POST /api/fields/{id}/reviews: Gửi đánh giá và bình luận vào bảng Review <br>API GET /api/fields/{id}/reviews: Danh sách đánh giá của khách hàng. <br>**Frontend:** <br>Dựng Search Page: Sidebar bộ lọc đa năng và danh sách kết quả hiển thị dạng Card <br>Dựng Pitch Detail Page: Trang chi tiết cực sâu gồm Slide ảnh, thông tin trung tâm, và bảng chọn giờ đặt sân; Module Review & Rating: Hiển thị sao và bình luận của người dùng.|[d145681](https://github.com/Loinv207/sports-facility-booking/pull/18/changes/d1456819f870ba04f86030b9c02edd5999f0c0a4)|
---
## 2. Tiến độ tổng thể
| Hạng mục                | Trạng thái   | %    |
|-------------------------|--------------|------|
| Khởi tạo dự án & Git    | Done         | 100% |
| Thiết kế Database       | Done         | 100% |
| Phân tích yêu cầu       | Done         | 100% |
| Backend API             | Đang làm     |  80% |
| Frontend UI             | Đang làm     |  65% |
| Docker                  | Chưa bắt đầu |   0% |
| Testing                 | Chưa bắt đầu |   0% |

---
## 3. Kế hoạch tuần tới
| Thành viên      | Công việc dự kiến                                                                                                                                   |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **Nguyễn Vinh Lợi** | **Backend:**<br>API Thanh toán đặt cọc: POST /api/payment/vnpay (Tạo URL thanh toán) và GET /api/payment/callback (Xử lý kết quả trả về từ ngân hàng).<br>API Cấu hình Commission: PUT /api/admin/config/commission (Thiết lập tỷ lệ % hoa hồng hệ thống).<br>API Quản lý Loại sân (Category): Trọn bộ CRUD GET/POST/PUT/DELETE /api/categories (Sân 5, sân 7, sân cầu lông...).<br>API Báo cáo Tài chính: GET /api/admin/reports/finance (Tổng doanh thu, tổng hoa hồng, số tiền thực nhận sau khi trừ phí).<br>**Frontend:**<br>Trang Admin Config: Giao diện quản lý loại sân và cấu hình % hoa hồng.<br>Admin Finance Dashboard: Biểu đồ tài chính chuyên sâu (Doanh thu thực tế vs Doanh thu hoa hồng).<br>Notification Center: Giao diện cho Admin gửi thông báo hệ thống đến toàn bộ User/Owner.
| **Lê Hồng Đức**     | **Backend:**<br>API Xác nhận/Từ chối Booking: PUT /api/owner/bookings/{id}/status (Duyệt hoặc từ chối lịch đặt của khách).<br>API Check-in: POST /api/owner/check-in (Xác nhận khách đã đến sân, chuyển trạng thái đơn hàng sang COMPLETED).<br>API Báo cáo doanh thu Owner: GET /api/owner/reports/revenue (Thống kê tiền cọc online và tiền mặt thu thêm tại sân).<br>Hoàn thiện CRUD Sân: Bổ sung API PUT /api/fields/{id} (Cập nhật thông tin) và DELETE /api/fields/{id} (Ẩn sân).<br>**Frontend:**<br>Owner Booking Manager: Giao diện quản lý danh sách các ca đã đặt, có nút "Xác nhận" và nút "Check-in".<br>Owner Revenue Chart: Biểu đồ doanh thu riêng cho chủ sân để họ theo dõi tình hình kinh doanh.<br>Update Field Form: Giao diện để chủ sân chỉnh sửa thông tin sân đã đăng ký. |                                                                                                                   |
| **Hồ Ngọc Minh**    | **Backend:**<br>API Tạo Booking: POST /api/bookings (Tạo đơn hàng chờ thanh toán).<br>API Lịch sử đặt sân: GET /api/user/bookings (Lấy danh sách sân đã đặt theo Token người dùng).<br>API Hủy/Đổi lịch: PUT /api/user/bookings/{id}/cancel (Xử lý logic hủy kèm điều kiện thời gian).<br>API Profile: GET/PUT /api/user/profile (Xem và cập nhật thông tin cá nhân).<br>**Frontend:**<br>User Dashboard: Trang "Lịch sử đặt sân" hiển thị trạng thái (Đã cọc, Đã hủy, Đã hoàn thành).<br>Booking Flow: Tích hợp luồng từ trang chi tiết sân sang trang thanh toán của Lợi.<br>Review System (Nâng cấp): Chỉ hiển thị nút "Đánh giá" khi đơn hàng có trạng thái COMPLETED (sau khi Đức nhấn check-in).<br>Trang Tìm kiếm nâng cao: Bổ sung lọc sân theo vị trí (Maps) và xếp hạng đánh giá tốt nhất. |                                                         |


*Ngày nộp: 26/04/2026*
*Xác nhận của Nhóm trưởng: Nguyễn Vinh Lợi*

