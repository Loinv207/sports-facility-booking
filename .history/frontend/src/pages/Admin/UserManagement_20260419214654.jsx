import React, { useState, useEffect } from 'react';
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
import { Search, UserPlus, MoreHorizontal, ShieldCheck, Lock, Unlock } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Vinh Lợi", email: "loi@ou.edu.vn", role: "ADMIN", status: "Active" },
    { id: 2, name: "Trần Văn Minh", email: "minh@example.com", role: "OWNER", status: "Active" },
    { id: 3, name: "Lê Thị Ysa", email: "ysa@example.com", role: "USER", status: "Locked" },
    // Dữ liệu mẫu, sau này Lợi fetch từ API nhé
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 bg-white border shadow-sm rounded-xl border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quản lý người dùng</h2>
          <p className="text-sm text-slate-500">Danh sách tất cả thành viên trong hệ thống của bạn.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" /> Thêm thành viên
        </Button>
      </div>

      <div className="flex items-center max-w-sm mb-6 space-x-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm theo tên hoặc email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="transition-colors hover:bg-slate-50/50">
                <TableCell className="font-medium">#{user.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-700">{user.name}</span>
                    <span className="text-xs text-slate-400">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {user.role === "ADMIN" ? (
                      <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                        <ShieldCheck className="w-3 h-3 mr-1" /> {user.role}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-slate-600">
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={user.status === "Active" ? "bg-green-500" : "bg-slate-400"}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-500">
                      {user.status === "Active" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-blue-500">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
        <span>Hiển thị {filteredUsers.length} trên tổng số {users.length} người dùng</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Trước</Button>
          <Button variant="outline" size="sm">Sau</Button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;