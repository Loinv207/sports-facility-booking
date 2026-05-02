
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
import { Search, ShieldCheck, UserCog, Lock, Unlock, Mail, Phone, AlertTriangle, X } from "lucide-react";
import AdminSidebar from './AdminSidebar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingUser, setPendingUser] = useState(null);
  const [submittingToggle, setSubmittingToggle] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState('success');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); 
      if (!token) return;

      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Backend trả về đối tượng Page nên ta lấy .content
      setUsers(res.data.content || []);
      setTotalUsers(res.data.totalElements || 0);
    } catch (err) {
      console.error("Lỗi lấy danh sách user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  ) : []; 

  const handleToggleStatus = async () => {
    if (!pendingUser) return;
    try {
      setSubmittingToggle(true);
      const token = localStorage.getItem('token');
      
      // Đã sửa path từ /toggle-status thành /status để khớp với @PutMapping("/{id}/status") ở Backend
      await axios.put(`/api/admin/users/${pendingUser.id}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchUsers(); // Tải lại danh sách sau khi cập nhật thành công
      setStatusTone('success');
      setStatusMessage(`Đã cập nhật trạng thái cho ${pendingUser.fullName || pendingUser.email}.`);
      setPendingUser(null);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      setStatusTone('error');
      setStatusMessage("Lỗi: Không thể cập nhật trạng thái người dùng.");
    } finally {
      setSubmittingToggle(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mx-auto space-y-6 max-w-7xl">
          
          {/* Header & Search Section */}
          <div className="flex flex-col items-start justify-between gap-4 p-6 bg-white border shadow-sm md:flex-row md:items-center rounded-xl border-slate-100">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                <UserCog className="text-blue-600" /> Quản lý người dùng
              </h2>
              <p className="mt-1 text-sm text-slate-500">Hệ thống đang quản lý {totalUsers} thành viên.</p>
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
            {statusMessage && (
              <div className={`mx-6 mt-6 flex items-start gap-3 rounded-xl border px-4 py-4 text-sm ${
                statusTone === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}>
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

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
                            
                            <span className="font-bold text-slate-800">{user.fullName || "Chưa đặt tên"}</span>
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
                            onClick={() => {
                              setPendingUser(user);
                              setStatusMessage('');
                            }}
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

      {/* Modal xác nhận */}
      {pendingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/45">
          <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl">
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Xác nhận thay đổi trạng thái</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Hành động này sẽ {pendingUser.status === 'ACTIVE' ? 'khóa' : 'mở khóa'} tài khoản người dùng.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !submittingToggle && setPendingUser(null)}
                className="p-2 transition rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="px-4 py-4 border rounded-xl border-slate-200 bg-slate-50">
                <p className="text-sm font-semibold text-slate-900">{pendingUser.fullName || 'Người dùng'}</p>
                <p className="mt-1 text-sm text-slate-600">{pendingUser.email}</p>
                <p className="mt-1 text-sm text-slate-500">Vai trò: {pendingUser.role}</p>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setPendingUser(null)}
                  disabled={submittingToggle}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleToggleStatus}
                  disabled={submittingToggle}
                  className={pendingUser.status === 'ACTIVE' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                >
                  {submittingToggle ? 'Đang xử lý...' : 'Xác nhận'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
