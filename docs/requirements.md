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
  <img src="UseCaseSport.png" width="700">
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






# ĐẶC TẢ LUỒNG NGHIỆP VỤ HỆ THỐNG ĐẶT SÂN THỂ THAO

## 1. Luồng Tìm Kiếm Sân (Search Flow)
Mục tiêu là giúp người dùng lọc ra những sân còn trống theo đúng thời gian và địa điểm mong muốn.

- **Bước 1 (Frontend):** Người dùng nhập các tiêu chí: Quận/Huyện, Loại sân (5/7/11), Ngày đá, Khung giờ (giờ bắt đầu - giờ kết thúc).
- **Bước 2 (API):** Frontend gọi API Request `GET /api/pitches/search` kèm các tham số.
- **Bước 3 (Backend):** - Truy vấn danh sách sân theo vị trí và loại sân.
    - **Kiểm tra lịch trùng:** Loại bỏ các sân có bản ghi trong bảng `Booking` trùng khung giờ đã chọn và có trạng thái là `CONFIRMED` hoặc `PENDING_PAYMENT`.
- **Bước 4 (Kết quả):** Trả về danh sách các sân thỏa mãn kèm thông tin chi tiết (giá, hình ảnh, tiện ích).

---

## 2. Luồng Đặt Sân (Booking Flow)
Quy trình giữ chỗ tạm thời và xác nhận thông tin thuê sân.

- **Bước 1:** Người dùng nhấn nút "Đặt sân" trên sân đã chọn.
- **Bước 2:** Hệ thống kiểm tra JWT. Nếu chưa có, yêu cầu điều hướng sang trang Đăng nhập.
- **Bước 3:** Frontend gửi `POST /api/bookings` kèm thông tin: `pitchId`, `date`, `startTime`, `endTime`.
- **Bước 4 (Backend):** - Kiểm tra lại tính khả dụng (Double check) để tránh tranh chấp dữ liệu.
    - Khởi tạo bản ghi mới trong DB với trạng thái `PENDING_PAYMENT`.
    - Thiết lập thời gian hết hạn (Time-to-live) cho đơn hàng (ví dụ: 10 phút).

---

## 3. Luồng Thanh Toán Cọc Online (Payment Flow)
Xác thực giao dịch tài chính để đảm bảo tính cam kết.

- **Bước 1:** Backend tích hợp cổng thanh toán (VNPay/Momo) để tạo chuỗi thanh toán mã hóa và trả về `paymentUrl`.
- **Bước 2:** Frontend chuyển hướng người dùng sang trang của phía Ngân hàng/Ví điện tử.
- **Bước 3:** Người dùng quét mã QR và thực hiện thanh toán tiền cọc theo % quy định.
- **Bước 4 (Webhook):** Cổng thanh toán gọi về API `/api/payment/callback` của Spring Boot để thông báo kết quả.
- **Bước 5 (Cập nhật):**
    - **Thành công:** Chuyển trạng thái Booking sang `CONFIRMED`.
    - **Thất bại/Hết hạn:** Chuyển trạng thái sang `CANCELLED` và giải phóng khung giờ cho người khác.

---

## 4. Luồng duyệt sân (Facility Approval Workflow)

Mục tiêu là đảm bảo các **facility (sân)** do **Facility Owner** đăng ký phải được **Admin kiểm tra và duyệt** trước khi hiển thị cho khách hàng đặt.

- **Bước 1 (Frontend):** Chủ sân tạo sân mới và nhập thông tin sân: Tên trung tâm, địa chỉ, thành phố/quận, tên sân, loại sân, mô tả, ngày, giờ bắt đầu, giờ kết thúc, giá và ảnh sân. Trạng thái mặc định của sân là `PENDING`.
- **Bước 2 (API):** Frontend (Admin) gọi API GET /api/admin/sports-centers?status=PENDING để lấy danh sách sân chờ duyệt.
- **Bước 3 (Backend):**

| Trường hợp | Trạng thái sân |
|--|--|
| Nếu admin chấp nhận | Cập nhật approval_status = APPROVED.|
| Nếu admin từ chối | Cập nhật approval_status = REJECTED.|

- **Bước 4 (Kết quả):**

| Trạng thái | Hiển thị tìm kiếm | Có thể đặt |
|-----------|------------------|------------|
| APPROVED  | Có               | Có         |
| PENDING   | Không            | Không      |
| REJECTED  | Không            | Không      |

---

## 5. Công Thức Tính Phí Hoa Hồng (Commission)

Mục tiêu là tính toán số tiền nền tảng thu được từ mỗi giao dịch đặt sân.

- **Bước 1 (Input):** Người dùng chọn khung giờ đặt sân → hệ thống nhận:  
  - `price`
  - `start_time`, `end_time`
- **Bước 2 (Backend):**  Hệ thống thực hiện tính toán dựa trên dữ liệu đầu vào.
	 - Tính tổng thời gian: total_hours = end_time - start_time.
	 - Tính tổng tiền: Total_Price = price × total_hours
- **Bước 3 (Commission):** Áp dụng tỷ lệ hoa hồng để tính phí nền tảng.

Ví dụ: Trong trường hợp tỷ lệ hoa hồng 10%:
| Thành phần | Giá trị |
|---|---|
| Commission_Rate | 10% |
| Commission | Total_Price × Commission_Rate |

- **Bước 4 (Kết quả):**

| Thông tin | Giá trị |  
|----------|--------|  
| Total_Price | Tổng tiền đặt sân |  
| Commission | Tiền nền tảng thu |  
| Owner_Receive | Total_Price - Commission |

---

## 6. Lưu thông tin đặt sân vào database (Booking Persistence Flow)

Mục tiêu là lưu thông tin đặt sân vào cơ sở dữ liệu một cách chính xác và đảm bảo tính nhất quán dữ liệu.

- **Bước 1 (Input):** Hệ thống nhận thông tin đặt sân: `field_id`, `user_id`, `booking_date`, `start_time`, `end_time`.

- **Bước 2 (Backend):**  Hệ thống kiểm tra trước khi lưu trữ dữ liệu.

| Điều kiện | Xử lý |
|---|---|
| Sân chưa được duyệt | Không cho phép lưu |
| Thời gian không hợp lệ | Không cho phép lưu |
| Khung giờ bị trùng | Không cho phép lưu |

- **Bước 3 (Database):** Nếu hợp lệ, hệ thống tạo bản ghi mới trong bảng Bookings: 

| Trường | Giá trị |
|---|---|
| field_id | ID sân |
| user_id | Người đặt |
| booking_date | Ngày đặt |
| start_time | Thời gian bắt đầu |
| end_time | Thời gian kết thúc |
| total_price | Giá đặt sân |
| status | `PENDING_PAYMENT` |
| expired_at | Thời gian hết hạn |

- **Bước 4 (Đảm bảo tính nhất quán):**

| Cơ chế | Mục đích |
|---|---|
| Transaction | Tránh ghi trùng dữ liệu |
| Kiểm tra trước khi insert | Đảm bảo không double bookings |

- **Bước 5 (Kết quả):**

| Trạng thái | Ý nghĩa |
|---|---|
| PENDING_PAYMENT | Đã lưu và chờ thanh toán |
| CONFIRMED | Đặt thành công |
| CANCELLED | Hết hạn/ hủy |

Việc kiểm tra trùng khung giờ được thực hiện theo Validation Flow (Mục 7).

---

## 7. Kiểm tra khung giờ đặt sân (Validation Flow)

Mục tiêu là đảm bảo khung giờ người dùng chọn **không bị trùng với các booking đã tồn tại** và hợp lệ để đặt.

- **Bước 1 (Input):** Hệ thống nhận thông tin đặt sân: `field_id`, `booking_date`, `start_time`,  `end_time`.

- **Bước 2 (Backend):**  Hệ thống kiểm tra các booking hiện có trong ngày.

| Điều kiện kiểm tra | Ý nghĩa |
|---|---|
| Cùng sân (`field_id`) | Xác định đúng sân |
| Cùng ngày (`booking_date`) | Giới hạn phạm vi kiểm tra |
| Trạng thái booking | Chỉ xét `CONFIRMED` và `PENDING_PAYMENT` |
| Khung giờ <br> (`start_time`, `end_time`) | Kiểm tra sự giao nhau giữa các khoảng thời gian |

- **Bước 3 (Logic kiểm tra) :** Hai khung giờ được xem là trùng nếu: <br> - start_time < existing_end_time <br> - AND  end_time > existing_start_time

- **Bước 4 (Kết quả):** 

| Trường hợp | Kết quả |
|---|---|
| Có khung giờ trùng | Không cho phép đặt |
| Không có khung giờ trùng | Cho phép tiếp tục |
