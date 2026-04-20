import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShieldCheck, UserCog, Lock, Unlock, Mail, Phone } from "lucide-react";
import AdminSidebar from './AdminSidebar';


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); 
      if (!token) return;

      const res = await axios.get('http://localhost:8080/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn thay đổi trạng thái người dùng này?")) return;
    try {
      const token = localStorage.getItem('token'); // Đã sửa từ admin_token thành token cho khớp
      await axios.put(`http://localhost:8080/api/admin/users/${userId}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers(); 
    } catch (err) {
      alert("Lỗi: Không thể cập nhật trạng thái người dùng.");
    }
  };

  return (
    // 2. Bọc toàn bộ bằng một thẻ div có class flex
    <div className="flex min-h-screen bg-slate-50">
      
      {/* 3. Sidebar nằm cố định bên trái */}
      <AdminSidebar />

      {/* 4. Phần nội dung chính nằm bên phải, chiếm hết khoảng trống còn lại (flex-1) */}
      <main className="flex-1 p-8">
        <div className="mx-auto space-y-6 max-w-7xl">
          
          {/* Header & Search Section */}
          <div className="flex flex-col items-start justify-between gap-4 p-6 bg-white border shadow-sm md:flex-row md:items-center rounded-xl border-slate-100">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                <UserCog className="text-blue-600" /> Quản lý người dùng
              </h2>
              <p className="mt-1 text-sm text-slate-500">Hệ thống đang quản lý {users.length} thành viên.</p>
            </div>

            <div className="relative w-full max-w-sm">
              <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
              <Input
                placeholder="Tìm theo tên hoặc email..."
                className="pl-10 transition-all bg-slate-50 border-slate-200 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-100">
            {loading ? (
              <div className="py-20 text-center text-slate-500 animate-pulse">
                Đang tải dữ liệu người dùng...
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700">Người dùng</TableHead>
                    <TableHead className="font-semibold text-slate-700">Vai trò</TableHead>
                    <TableHead className="font-semibold text-slate-700">Liên hệ</TableHead>
                    <TableHead className="font-semibold text-slate-700">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-right text-slate-700">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="transition-colors hover:bg-slate-50/50">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{user.fullName}</span>
                            <div className="flex items-center mt-1 text-xs text-slate-400">
                              <Mail className="w-3 h-3 mr-1" /> {user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.role === 'ADMIN' ? "destructive" : "secondary"}
                            className="font-medium"
                          >
                            {user.role === 'ADMIN' && <ShieldCheck className="w-3 h-3 mr-1" />}
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm italic text-slate-600">
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1 text-slate-400" />
                            {user.phone || "Chưa cập nhật"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={user.status === 'ACTIVE' 
                              ? "bg-green-100 text-green-700 hover:bg-green-100 shadow-none" 
                              : "bg-red-100 text-red-700 hover:bg-red-100 shadow-none"
                            }
                          >
                            {user.status === 'ACTIVE' ? "Đang hoạt động" : "Bị khóa"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleStatus(user.id)}
                            className={`font-medium transition-all ${
                              user.status === 'ACTIVE' 
                              ? "text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700" 
                              : "text-green-600 border-green-100 hover:bg-green-50 hover:text-green-700"
                            }`}
                          >
                            {user.status === 'ACTIVE' ? (
                              <><Lock className="w-3 h-3 mr-2" /> Khóa</>
                            ) : (
                              <><Unlock className="w-3 h-3 mr-2" /> Mở khóa</>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-20 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="w-10 h-10 mb-2 opacity-20" />
                          <p>Không tìm thấy người dùng nào phù hợp.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;