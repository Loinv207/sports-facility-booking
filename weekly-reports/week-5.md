
# Báo cáo Tuần 5
**Tuần:** 5 (30/03/2026 - 05/04/2026)

**Nhóm:** 3

**Đề tài:** 2 - Đặt Sân Thể Thao

**Nhóm trưởng:** Nguyễn Vinh Lợi - 2251052061
---
## 1. Công việc đã hoàn thành
| Thành viên      | MSSV       | Công việc                                                              | Link Commit/PR |
|-----------------|------------|------------------------------------------------------------------------|----------------|
| Nguyễn Vinh Lợi | 2251052061 | Dựng trang Search phía FE|[dc4cbda](https://github.com/Loinv207/sports-facility-booking/commit/dc4cbda1efaae0e653707eac695d383ffca579a8)|
| Lê Hồng Đức     | 2251052021 | Viết API thêm/sửa/xóa sân thể thao. Đặc biệt là logic tạo khung giờ (Time Slots) cho từng sân để khách có thể chọn|[9c9edae](https://github.com/Loinv207/sports-facility-booking/pull/12/changes/9c9edae4b30fff6f654e313320f25450f00d8aa0)|
| Hồ Ngọc Minh    | 2251012092 | update requirement|[9f159f4](https://github.com/Loinv207/sports-facility-booking/pull/11/changes/9f159f4e76492a5532feb47b6311b75ea0e96e17)|
---
## 2. Tiến độ tổng thể
| Hạng mục                | Trạng thái   | %    |
|-------------------------|--------------|------|
| Khởi tạo dự án & Git    | Done         | 100% |
| Thiết kế Database       | Done         | 100% |
| Phân tích yêu cầu       | Done         | 100% |
| Backend API             | Đang làm     |  60% |
| Frontend UI             | Đang làm     |  20% |
| Docker                  | Chưa bắt đầu |   0% |
| Testing                 | Chưa bắt đầu |   0% |

---
## 3. Kế hoạch tuần tới
| Thành viên      | Công việc dự kiến                                                                                                                                   |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **Nguyễn Vinh Lợi** | **Backend:** Hoàn thiện Security (JWT). Viết API PUT /api/admin/fields/{id}/approve để đổi trạng thái sân sang ACTIVE <br>**Frontend:** Dựng trang Admin đơn giản liệt kê các sân đang PENDING và nút "Duyệt"|
| **Lê Hồng Đức**     | **Backend:** Viết API POST /api/fields để lưu sân mới và DB (trạng thái mặc định là PENDING). <br>**Frontend:** dựng form thêm sân (Tên, loại sân, địa chỉ, giá , mô tả) |                                                                                                                   |
| **Hồ Ngọc Minh**    |**Backend**: Viết API GET /api/fields/active (Chỉ lấy những sân có trạng thái ACTIVE). <br>**Frontend:** Dựng giao diện trang chủ, gọi API để hiển thị danh sách sân dưới dạng các thẻ (Card). |                                                         |


*Ngày nộp: 05/04/2026*
*Xác nhận của Nhóm trưởng: Nguyễn Vinh Lợi*



