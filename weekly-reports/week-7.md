# Báo cáo Tuần 7
**Tuần:** 7 (13/04/2026 - 19/04/2026)

**Nhóm:** 3

**Đề tài:** 2 - Đặt Sân Thể Thao

**Nhóm trưởng:** Nguyễn Vinh Lợi - 2251052061
---
## 1. Công việc đã hoàn thành
| Thành viên      | MSSV       | Công việc                                                              | Link Commit/PR |
|-----------------|------------|------------------------------------------------------------------------|----------------|
| **Nguyễn Vinh Lợi** | 2251052061 | **Backend:** <br>Hoàn thiện Security (JWT)<br>Viết API PUT /api/admin/fields/{id}/approve để đổi trạng thái sân sang ACTIVE<br>**Frontend:** <br>Dựng trang Admin đơn giản liệt kê các sân đang PENDING và nút "Duyệt"|[51cf131](https://github.com/Loinv207/sports-facility-booking/pull/17/changes/51cf131ebf507edfec646b41617a45c135723229)|
| **Lê Hồng Đức**     | 2251052021 | **Backend:** <br>Viết API POST /api/fields để lưu sân mới và DB (trạng thái mặc định là PENDING)<br>**Frontend:**<br>Dựng form thêm sân (Tên, loại sân, địa chỉ, giá, mô tả)|[74ef751](https://github.com/Loinv207/sports-facility-booking/pull/16/changes/74ef7513ea9c0b47b9a5130d44f6c7124d84fb54)|
| **Hồ Ngọc Minh**    | 2251012092 | **Backend:** <br>Viết API GET /api/fields/active (Chỉ lấy những sân có trạng thái ACTIVE) <br>**Frontend:** <br>Dựng giao diện trang chủ, gọi API để hiển thị danh sách sân dưới dạng các thẻ (Card).|[f1ac42b](https://github.com/Loinv207/sports-facility-booking/pull/15/changes/f1ac42bd04b7f340b37e7cd62cf938a3fde002e3)|
---
## 2. Tiến độ tổng thể
| Hạng mục                | Trạng thái   | %    |
|-------------------------|--------------|------|
| Khởi tạo dự án & Git    | Done         | 100% |
| Thiết kế Database       | Done         | 100% |
| Phân tích yêu cầu       | Done         | 100% |
| Backend API             | Đang làm     |  75% |
| Frontend UI             | Đang làm     |  40% |
| Docker                  | Chưa bắt đầu |   0% |
| Testing                 | Chưa bắt đầu |   0% |

---
## 3. Kế hoạch tuần tới
| Thành viên      | Công việc dự kiến                                                                                                                                   |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **Nguyễn Vinh Lợi** | **Backend:**<br>API Thanh toán đặt cọc: POST /api/payment/vnpay (Tạo URL thanh toán) và GET /api/payment/callback (Xử lý kết quả trả về từ ngân hàng).
<br>API Cấu hình Commission: PUT /api/admin/config/commission (Thiết lập tỷ lệ % hoa hồng hệ thống).
<br>API Quản lý Loại sân (Category): Trọn bộ CRUD GET/POST/PUT/DELETE /api/categories (Sân 5, sân 7, sân cầu lông...).
<br>API Báo cáo Tài chính: GET /api/admin/reports/finance (Tổng doanh thu, tổng hoa hồng, số tiền thực nhận sau khi trừ phí).
<br>**Frontend:**
<br>Trang Admin Config: Giao diện quản lý loại sân và cấu hình % hoa hồng.
<br>Admin Finance Dashboard: Biểu đồ tài chính chuyên sâu (Doanh thu thực tế vs Doanh thu hoa hồng).
<br>Notification Center: Giao diện cho Admin gửi thông báo hệ thống đến toàn bộ User/Owner. |
| **Lê Hồng Đức**     | **Backend:**
<br>API Xác nhận/Từ chối Booking: PUT /api/owner/bookings/{id}/status (Duyệt hoặc từ chối lịch đặt của khách).
<br>API Check-in: POST /api/owner/check-in (Xác nhận khách đã đến sân, chuyển trạng thái đơn hàng sang COMPLETED).
<br>API Báo cáo doanh thu Owner: GET /api/owner/reports/revenue (Thống kê tiền cọc online và tiền mặt thu thêm tại sân).
<br>Hoàn thiện CRUD Sân: Bổ sung API PUT /api/fields/{id} (Cập nhật thông tin) và DELETE /api/fields/{id} (Ẩn sân).
**Frontend:**
<br>Owner Booking Manager: Giao diện quản lý danh sách các ca đã đặt, có nút "Xác nhận" và nút "Check-in".
<br>Owner Revenue Chart: Biểu đồ doanh thu riêng cho chủ sân để họ theo dõi tình hình kinh doanh.
<br>Update Field Form: Giao diện để chủ sân chỉnh sửa thông tin sân đã đăng ký. |                                                                                                                   |
| **Hồ Ngọc Minh**    | **Backend:**
<br>API Tạo Booking: POST /api/bookings (Tạo đơn hàng chờ thanh toán).
<br>API Lịch sử đặt sân: GET /api/user/bookings (Lấy danh sách sân đã đặt theo Token người dùng).
<br>API Hủy/Đổi lịch: PUT /api/user/bookings/{id}/cancel (Xử lý logic hủy kèm điều kiện thời gian).
<br>API Profile: GET/PUT /api/user/profile (Xem và cập nhật thông tin cá nhân).
**Frontend:**
<br>User Dashboard: Trang "Lịch sử đặt sân" hiển thị trạng thái (Đã cọc, Đã hủy, Đã hoàn thành).
<br>Booking Flow: Tích hợp luồng từ trang chi tiết sân sang trang thanh toán của Lợi.
<br>Review System (Nâng cấp): Chỉ hiển thị nút "Đánh giá" khi đơn hàng có trạng thái COMPLETED (sau khi Đức nhấn check-in).
<br>Trang Tìm kiếm nâng cao: Bổ sung lọc sân theo vị trí (Maps) và xếp hạng đánh giá tốt nhất. |                                                         |


*Ngày nộp: 19/04/2026*
*Xác nhận của Nhóm trưởng: Nguyễn Vinh Lợi*

