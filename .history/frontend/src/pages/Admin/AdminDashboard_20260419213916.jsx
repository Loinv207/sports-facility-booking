import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, DollarSign, CalendarCheck, TrendingUp } from "lucide-react";
import axios from 'axios';

const AdminDashboard = () => {
  const [data, setData] = useState({ totalRevenue: 0, totalBookings: 0 });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await axios.get('http://localhost:8080/api/admin/reports/system', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Lỗi fetch API:", err);
      }
    };
    fetchReport();
  }, []);

  // Giả lập dữ liệu tăng trưởng để biểu đồ nhìn đẹp (Sau này Lợi làm API list thì thay vào)
  const chartData = [
    { name: 'Tháng 1', revenue: 400000, bookings: 4 },
    { name: 'Tháng 2', revenue: 300000, bookings: 3 },
    { name: 'Tháng 3', revenue: 200000, bookings: 2 },
    { name: 'Hiện tại', revenue: data.totalRevenue, bookings: data.totalBookings },
  ];

  return (
    <div className="min-h-screen p-8 space-y-8 bg-slate-50">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Hệ Thống</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-500">Cập nhật mới nhất: {new Date().toLocaleDateString('vi-VN')}</span>
        </div>
      </div>

      {/* 4 Thẻ KPI chính */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.totalRevenue?.toLocaleString('vi-VN')} VNĐ
            </div>
            <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tổng Booking</CardTitle>
            <CalendarCheck className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.totalBookings} lượt</div>
            <p className="text-xs text-muted-foreground">+5% từ hôm qua</p>
          </CardContent>
        </Card>

        {/* Thêm các thẻ giả lập cho đẹp giao diện */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Người Dùng Mới</CardTitle>
            <Users className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">+48</div>
            <p className="text-xs text-muted-foreground">Đang hoạt động: 1,200</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tỉ lệ lấp đầy sân</CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">82%</div>
            <p className="text-xs text-muted-foreground">Tăng 2% so với tuần trước</p>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Biểu đồ Doanh thu</CardTitle>
            <CardDescription>Chi tiết doanh thu theo các tháng gần nhất.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Tăng trưởng Booking</CardTitle>
            <CardDescription>Số lượng đặt sân theo thời gian.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#e11d48" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;