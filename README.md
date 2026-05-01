# Hệ Thống Đặt Sân Thể Thao - Nhóm 3
## Mô tả
́Hệ thống Đặt sân thể thao trực tuyến là nền tảng kết nối giữa người chơi và chủ sân nhằm giải quyết tình trạng đặt sân thủ công qua điện thoại vốn gây mất thời gian và dễ trùng lịch. Dự án cung cấp giải pháp cho phép khách hàng chủ động tìm kiếm sân theo vị trí, xem lịch trống thời gian thực và thực hiện đặt cọc online nhanh chóng. Bên cạnh đó, hệ thống hỗ trợ chủ sân quản lý thông tin, cấu hình bảng giá linh hoạt và check-in khách hàng, đồng thời tích hợp các tính năng thú vị như hủy/đổi lịch linh hoạt, đánh giá dịch vụ và cơ chế tính hoa hồng (commission) cho quản trị viên.
## Thành viên nhóm
| MSSV       | Họ tên                        | Vai trò   |
|------------|-------------------------------|-----------|
| 2251052061 | Nguyễn Vinh Lợi (Nhóm trưởng) | Fullstack |
| 2251052021 | Lê Hồng Đức                   | Fullstack |
| 2251012092 | Hồ Ngọc Minh                  | Fullstack |
## Công nghệ sử dụng
- Backend: Spring Boot
- Frontend: React / Thymeleaf
- Database: MySQL
## Cài đặt và chạy
### Yêu cầu
- Java 21
- Node.js 18+
- MySQL hoặc quyền truy cập database RDS đã cấu hình

### Chạy Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```

### Truy cập
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

## Chạy bằng Docker
Dự án đã có sẵn:
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.yml`

### Build và chạy toàn bộ hệ thống
```bash
docker compose up --build
```

### Truy cập khi chạy Docker
- Frontend: http://localhost:4173
- Backend API: http://localhost:8080

### Lưu ý Docker
- `docker-compose.yml` hiện dùng cùng cấu hình database MySQL RDS như project đang chạy thật.
- Nếu muốn demo hoàn toàn local, có thể cấu hình thêm service MySQL riêng trong `docker-compose.yml`.

## Demo

## Tài liệu
- [Phân tích yêu cầu](docs/requirements.md)
- [Database Design](docs/database-design.md)
- [API Documentation](docs/api-docs.md) 
