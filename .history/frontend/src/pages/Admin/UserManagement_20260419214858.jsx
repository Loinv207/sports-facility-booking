import React, { useState, useEffect } from 'react';
// ... các import khác giữ nguyên
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]); // Khởi tạo mảng rỗng
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Hàm gọi API lấy danh sách User
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token'); // Lấy token nếu có bảo mật
      const res = await axios.get('http://localhost:8080/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Giả sử API trả về mảng user trực tiếp
      setUsers(res.data); 
    } catch (err) {
      console.error("Lỗi khi lấy danh sách user:", err);
      // Nếu lỗi, mình có thể thông báo cho người dùng ở đây
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Logic lọc user theo search term
  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm xử lý Khóa/Mở khóa User (Ví dụ nhanh cho Lợi)
  const handleToggleStatus = async (userId) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/users/${userId}/toggle-status`);
      fetchUsers(); // Gọi lại hàm lấy dữ liệu để cập nhật UI
    } catch (err) {
      alert("Không thể thay đổi trạng thái user");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu người dùng...</div>;

  return (
    <div className="min-h-screen p-8 bg-white border shadow-sm rounded-xl border-slate-100">
      {/* ... Phần Header và Search giữ nguyên ... */}

      <div className="border rounded-md">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700">{user.fullName}</span>
                      <span className="text-xs text-slate-400">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role?.name || user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.phone || "N/A"}</TableCell>
                  <TableCell className="text-right">
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleToggleStatus(user.id)}
                        className={user.status === 'ACTIVE' ? "text-red-500" : "text-green-500"}
                     >
                       {user.status === 'ACTIVE' ? "Khóa" : "Mở khóa"}
                     </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-slate-400">
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;