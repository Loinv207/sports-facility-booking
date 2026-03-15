# Sports Facility Booking System - Requirements

## 1. Actors
Hệ thống có 3 tác nhân chính:

- Khách hàng
- Chủ sân
- Admin

## 2. Functional Requirements

### 2.1 Khách hàng:
- Tìm sân theo vị trí và loại sân
- Xem lịch trống và đặt sân online
- Thanh toán đặt cọc
- Xem lịch sử đặt sân
- Hủy/đổi lịch đặt
- Đánh giá sân

### 2.2 Chủ sân:
- Quản lý thông tin sân (CRUD)
- Cấu hình khung giờ và giá
- Xem lịch đặt sân 
- Xác nhận/từ chối đặt
- Check-in khách đến
- Báo cáo doanh thu

### 2.3 Admin:
- Duyệt sân mới đăng ký
- Quản lý chủ sân (CRUD)
- Quản lý danh mục loại sân
- Cấu hình commission
- Báo cáo toàn hệ thống
- Quản lý thông báo

## 3. Use Case Diagram

<p align="center">
  <img src="UseCase.png" width="700">
</p>

## 4. Use Case Specifications

### 4.1 Duyệt sân

|Use case ID|UC01|
|---|---|
|Tên use case |Duyệt sân|
|Mô tả|Admin kiểm tra và phê duyệt các sân mới do chủ sân đăng ký.|
|Actor chính|Admin|
|Actor phụ|Chủ sân|
|Pre-Conditions <br>(Tiền điều kiện)|Chủ sân đã đăng ký sân và chờ duyệt (**Pending**).|
|Post-Conditions <br>(Hậu điều kiện)|Hệ thống cập nhật trạng thái sân và thông báo kết quả cho chủ sân.|
|Luồng hoạt động|1. Admin truy cập vào quản lý sân. <br> 2. Hệ thống hiển thị các sân đang ở trạng thái chờ duyệt (**Pending**). <br> 3. Admin chọn một sân để xem chi tiết. <br> 4. Hệ thống hiển thị thông tin sân (tên sân, địa chỉ, giá thuê, ảnh sân). <br> 5. Admin kiểm tra thông tin sân. <br> 6. Admin chọn Duyệt (**Approve**). <br> 7. Hệ thống cập nhật trạng thái sân thành **Approved**. <br> 8. Hệ thống thông báo duyệt sân thành công cho Admin và gửi thông báo cho chủ sân.|
|Luồng thay thế|A1 - Thông tin sân không đầy đủ <br> Ở bước 5 nếu thông tin sân không đầy đủ hoặc không hợp lệ, Admin chọn **Yêu cầu chỉnh sửa**. Hệ thống gửi thông báo yêu cầu cập nhật thông tin cho chủ sân, sân vẫn ở trạng thái **Pending**. <br> A2 - Từ chối sân <br> Ở bước 6 Admin chọn từ chối (**Reject**) và nhập lý do từ chối. Hệ thống cập nhật trạng thái sân thành **Rejected** và gửi thông báo về cho chủ sân.|
|Luồng ngoại lệ|E1 - Lỗi hệ thống <br> Trong trường hợp lỗi kỹ thuật hoặc không thể xác nhận duyệt sân, hiển thị thông báo lỗi và yêu cầu Admin thử lại.|

### 4.2 Cấu hình Commission

|Use case ID|UC02|
|---|---|
|Tên use case |Cấu hình Commission|
|Mô tả|Admin cấu hình tỷ lệ commission cho hệ thống.|
|Actor chính|Admin|
|Pre-Conditions|Admin truy cập trang cấu hình commission.|
|Post-Conditions|Hệ thống lưu tỷ lệ commission mới.|
|Luồng hoạt động|1. Admin truy cập trang **Cấu hình Commission**. <br> 2. Hệ thống hiển thị tỷ lệ commission hiện tại. <br> 3. Admin nhập tỷ lệ commission mới. <br> 4. Admin chọn **Lưu cấu hình**. <br> 5. Hệ thống cập nhật commission vào hệ thống. <br> 6. Hệ thống hiển thị thông báo cập nhật thành công.|
|Luồng thay thế|A1 – Commission không hợp lệ <br> Nếu commission nhập vào nhỏ hơn 0 hoặc lớn hơn 100, hệ thống hiển thị thông báo lỗi và yêu cầu Admin nhập lại.|
|Luồng ngoại lệ|E1 – Lỗi hệ thống <br> Nếu xảy ra lỗi hệ thống hoặc lỗi cơ sở dữ liệu, hệ thống hiển thị thông báo lỗi và yêu cầu Admin thử lại.|

## 5. Design Dashboard Admin UI

<p align="center">
  <img src="Dashboard_Admin_UI.png" width="700">
</p>
