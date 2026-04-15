# Báo cáo Tuần 6
**Tuần:** 6 (06/04/2026 - 12/04/2026)

**Nhóm:** 3

**Đề tài:** 2 - Đặt Sân Thể Thao

**Nhóm trưởng:** Nguyễn Vinh Lợi - 2251052061
---
## 1. Công việc đã hoàn thành
| Thành viên      | MSSV       | Công việc                                                              | Link Commit/PR |
|-----------------|------------|------------------------------------------------------------------------|----------------|
| Nguyễn Vinh Lợi | 2251052061 | **Backend:** <br>Hoàn thiện Security (JWT)<br>Viết API PUT /api/admin/fields/{id}/approve để đổi trạng thái sân sang ACTIVE<br>**Frontend:** <br>Dựng trang Admin đơn giản liệt kê các sân đang PENDING và nút "Duyệt"|[51cf131](https://github.com/Loinv207/sports-facility-booking/pull/17/changes/51cf131ebf507edfec646b41617a45c135723229)|
| Lê Hồng Đức     | 2251052021 | **Backend:** <br>Viết API POST /api/fields để lưu sân mới và DB (trạng thái mặc định là PENDING)<br>**Frontend:**<br>Dựng form thêm sân (Tên, loại sân, địa chỉ, giá, mô tả)|[74ef751](https://github.com/Loinv207/sports-facility-booking/pull/16/changes/74ef7513ea9c0b47b9a5130d44f6c7124d84fb54)|
| Hồ Ngọc Minh    | 2251012092 | **Backend:** <br>Viết API GET /api/fields/active (Chỉ lấy những sân có trạng thái ACTIVE) <br>**Frontend:** <br>Dựng giao diện trang chủ, gọi API để hiển thị danh sách sân dưới dạng các thẻ (Card).|[f1ac42b](https://github.com/Loinv207/sports-facility-booking/pull/15/changes/f1ac42bd04b7f340b37e7cd62cf938a3fde002e3)|
---
## 2. Tiến độ tổng thể
| Hạng mục                | Trạng thái   | %    |
|-------------------------|--------------|------|
| Khởi tạo dự án & Git    | Done         | 100% |
| Thiết kế Database       | Done         | 100% |
| Phân tích yêu cầu       | Done         | 100% |
| Backend API             | Đang làm     |  70% |
| Frontend UI             | Đang làm     |  40% |
| Docker                  | Chưa bắt đầu |   0% |
| Testing                 | Chưa bắt đầu |   0% |

---
## 3. Kế hoạch tuần tới
| Thành viên      | Công việc dự kiến                                                                                                                                   |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| Nguyễn Vinh Lợi | **Backend:** <br>API GET /api/admin/users: Liệt kê danh sách tất cả người dùng kèm Role và UserProfile<br>API PUT /api/admin/users/{id}/status: Khóa/Mở khóa tài khoản người dùng <br>API GET /api/admin/reports/system: Tổng hợp dữ liệu từ bảng SystemReport để lấy doanh thu và số lượng Booking <br>API POST /api/notifications: Tạo thông báo mới gửi đến người dùng (Table Notification). <br>**Frontend:** <br>Dựng Admin Dashboard: Hiển thị biểu đồ tăng trưởng User và Doanh thu (sử dụng Chart.js) <br>Trang User Management: Giao diện quản lý danh sách thành viên chuyên nghiệp <br>Module Security: Hoàn thiện bộ lọc JWT để phân quyền chính xác: Admin, Owner, User|
| Lê Hồng Đức     | **Backend:** <br>API POST /api/owner/fields/{id}/images: API upload và lưu link ảnh vào bảng FieldImage <br>API DELETE /api/owner/fields/images/{imageId}: Xóa ảnh sân <br>API GET /api/owner/fields/{id}/schedules: Lấy danh sách khung giờ và giá tiền từ bảng FieldSchedule <br>API POST /api/owner/fields/{id}/schedules/bulk: Tạo hàng loạt khung giờ cho sân <br>API PUT /api/owner/centers/{id}: Cập nhật thông tin trung tâm thể thao (Table SportsCenter) <br>**Frontend:** <br>Nâng cấp Owner Management: Thêm tính năng upload đa ảnh và quản lý thư viện ảnh sân <br>Dựng giao diện Schedule Manager: Bảng quản lý giờ giấc (Time-slot) trực quan cho chủ sân|                                                                                                                   |
| Hồ Ngọc Minh    | **Backend:** <br>API GET /api/fields/search: API tìm kiếm cực mạnh. Lọc theo SportsType, address, khoảng giá, và rating <br>API GET /api/fields/{id}/full-details: Lấy toàn bộ thông tin từ Field, FieldImage, FieldSchedule, và SportsCenter <br>API POST /api/fields/{id}/reviews: Gửi đánh giá và bình luận vào bảng Review <br>API GET /api/fields/{id}/reviews: Danh sách đánh giá của khách hàng. <br>**Frontend:** <br>Dựng Search Page: Sidebar bộ lọc đa năng và danh sách kết quả hiển thị dạng Card <br>Dựng Pitch Detail Page: Trang chi tiết cực sâu gồm Slide ảnh, thông tin trung tâm, và bảng chọn giờ đặt sân; Module Review & Rating: Hiển thị sao và bình luận của người dùng.
 |                                                         |


*Ngày nộp: 15/04/2026*
*Xác nhận của Nhóm trưởng: Nguyễn Vinh Lợi*


