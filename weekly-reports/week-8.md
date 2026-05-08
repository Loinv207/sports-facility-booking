# Báo cáo Tuần 8
**Tuần:** 8 (20/04/2026 - 26/04/2026)

**Nhóm:** 3

**Đề tài:** 2 - Đặt Sân Thể Thao

**Nhóm trưởng:** Nguyễn Vinh Lợi - 2251052061
---
## 1. Công việc đã hoàn thành
| Thành viên      | MSSV       | Công việc                                                              | Link Commit/PR |
|-----------------|------------|------------------------------------------------------------------------|----------------|
| **Nguyễn Vinh Lợi** | 2251052061 | **Backend:**<br>API Cấu hình Commission: PUT /api/admin/config/commission (Thiết lập tỷ lệ % hoa hồng hệ thống).<br>API Quản lý Loại sân (Category): Trọn bộ CRUD GET/POST/PUT/DELETE /api/categories (Sân 5, sân 7, sân cầu lông...).<br>API Báo cáo Tài chính: GET /api/admin/reports/finance (Tổng doanh thu, tổng hoa hồng, số tiền thực nhận sau khi trừ phí).<br>**Frontend:**<br>Trang Admin Config: Giao diện quản lý loại sân và cấu hình % hoa hồng.<br>Admin Finance Dashboard: Biểu đồ tài chính chuyên sâu (Doanh thu thực tế vs Doanh thu hoa hồng).<br>Notification Center: Giao diện cho Admin gửi thông báo hệ thống đến toàn bộ User/Owner.|[126f5bb](https://github.com/Loinv207/sports-facility-booking/pull/23/changes/126f5bbe55bf665d329b89276199468de024688d)|
| **Lê Hồng Đức**     | 2251052021 | **Backend:** <br>API POST /api/owner/fields/{id}/images: API upload và lưu link ảnh vào bảng FieldImage <br>API DELETE /api/owner/fields/images/{imageId}: Xóa ảnh sân <br>API GET /api/owner/fields/{id}/schedules: Lấy danh sách khung giờ và giá tiền từ bảng FieldSchedule <br>API POST /api/owner/fields/{id}/schedules/bulk: Tạo hàng loạt khung giờ cho sân <br>API PUT /api/owner/centers/{id}: Cập nhật thông tin trung tâm thể thao (Table SportsCenter) <br>**Frontend:** <br>Nâng cấp Owner Management: Thêm tính năng upload đa ảnh và quản lý thư viện ảnh sân <br>Dựng giao diện Schedule Manager: Bảng quản lý giờ giấc (Time-slot) trực quan cho chủ sân|[d597055](https://github.com/Loinv207/sports-facility-booking/commit/d597055f4e8279bd6b446b5b04226fc7c2139398)|
| **Hồ Ngọc Minh**    | 2251012092 | **Backend:** <br>API GET /api/fields/search: API tìm kiếm cực mạnh. Lọc theo SportsType, address, khoảng giá, và rating <br>API GET /api/fields/{id}/full-details: Lấy toàn bộ thông tin từ Field, FieldImage, FieldSchedule, và SportsCenter <br>API POST /api/fields/{id}/reviews: Gửi đánh giá và bình luận vào bảng Review <br>API GET /api/fields/{id}/reviews: Danh sách đánh giá của khách hàng. <br>**Frontend:** <br>Dựng Search Page: Sidebar bộ lọc đa năng và danh sách kết quả hiển thị dạng Card <br>Dựng Pitch Detail Page: Trang chi tiết cực sâu gồm Slide ảnh, thông tin trung tâm, và bảng chọn giờ đặt sân; Module Review & Rating: Hiển thị sao và bình luận của người dùng.|[38515c3](https://github.com/Loinv207/sports-facility-booking/pull/22/changes/38515c3a51865848d1cd5ba443b267e32c7e1d6e)|
---
## 2. Tiến độ tổng thể
| Hạng mục                | Trạng thái   | %    |
|-------------------------|--------------|------|
| Khởi tạo dự án & Git    | Done         | 100% |
| Thiết kế Database       | Done         | 100% |
| Phân tích yêu cầu       | Done         | 100% |
| Backend API             | Đang làm     |  90% |
| Frontend UI             | Đang làm     |  85% |
| Docker                  | Chưa bắt đầu |   0% |
| Testing                 | Chưa bắt đầu |  20% |

---
## 3. Kế hoạch tuần tới
| Thành viên      | Công việc dự kiến                                                                                                                                   |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **Nguyễn Vinh Lợi** | **Backend:**<br>API Thanh toán đặt cọc: POST /api/payment/vnpay (Tạo URL thanh toán) và GET /api/payment/callback (Xử lý kết quả trả về từ ngân hàng).<br>Logic Tài chính: Cập nhật API Báo cáo tài chính để tự động trừ % Commission vào netAmount dựa trên dữ liệu thực tế từ các đơn hàng PAID<br>Email Service: Viết Service gửi email tự động (dùng Java Mail Sender) khi Admin duyệt sân mới hoặc khi có thông báo quan trọng.<br>Broadcast Notification: Hoàn thiện API gửi thông báo hàng loạt cho toàn bộ User/Owner từ trang Admin Center.<br>**Frontend:**<br>Admin Dashboard: Tích hợp biểu đồ Chart.js vào trang báo cáo để so sánh trực quan giữa Doanh thu tổng và Hoa hồng hệ thống.<br>Security: Kiểm tra và chặn truy cập trái phép bằng JWT, đảm bảo các link /api/admin/ chỉ Admin mới vào được.<br>**Nhiệm vụ khác:**<br>Tạo khoảng 5 tài khoản User và 3 tài khoản Owner với tên người dùng tiếng Việt rõ ràng (Ví dụ: nguyenvana, chu_san_quan_1)<br>Gán đúng Role cho từng tài khoản để khi Demo không bị nhầm lẫn|
| **Lê Hồng Đức** | **Backend:**<br>API Check-in: Hoàn thiện logic khi bấm Check-in: Chuyển trạng thái Booking sang COMPLETED và cập nhật doanh thu thực tế (vd: tiền cọc + tiền mặt thu tại sân).<br>Logic Hủy lịch: Viết điều kiện: Nếu sân đã bị hủy, slot thời gian đó trong bảng FieldSchedule phải tự động chuyển về trạng thái AVAILABLE.<br>**Frontend:**<br>Owner Booking Manager: Nâng cấp giao diện quản lý lịch đặt. Thêm nút "Check-in" và "Hủy lịch" với thông báo xác nhận (Confirm modal).<br>Revenue Chart: Dựng biểu đồ doanh thu theo tuần/tháng cho chủ sân (Chart.js).|                                                                                                             |
| **Hồ Ngọc Minh**    | **Backend:**<br>Review Logic: Ràng buộc API đánh giá: Chỉ cho phép người dùng POST /reviews khi đơn hàng của họ đã ở trạng thái COMPLETED.<br>Search Nâng cao: Tối ưu API tìm kiếm để lọc sân theo vị trí (gần đúng) và loại sân cùng lúc.<br>**Frontend:**<br>Booking Flow: Kiểm tra lại luồng từ chọn giờ -> Thanh toán VNPay -> Quay lại trang Lịch sử đơn hàng.<br>Profile & History: Hoàn thiện trang cá nhân, cho phép người dùng xem lại lịch sử đặt sân và trạng thái thanh toán.<br>Validation UI: Thêm thông báo lỗi khi người dùng chọn giờ đã có người đặt hoặc đặt sân vào giờ quá khứ.<br>**Nhiệm vụ khác:**<br>Lên mạng (Google Maps hoặc các app như PlaySport) tìm thông tin của khoảng 5-10 sân thực tế tại TP.HCM (Ví dụ: Sân bóng đá Đại học Mở, Sân cầu lông Kỳ Hòa).<br>Lấy địa chỉ thật, giá tiền thật và tải hình ảnh thực tế của các sân đó về.<br>Thực hiện: Dùng chính Form "Thêm sân" mà Đức đã làm để nhập liệu để tạo dữ liệu thật|                                                         |


*Ngày nộp: 26/04/2026*
*Xác nhận của Nhóm trưởng: Nguyễn Vinh Lợi*

