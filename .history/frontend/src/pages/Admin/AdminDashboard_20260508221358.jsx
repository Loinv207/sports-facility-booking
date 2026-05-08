

// import React, { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { Users, DollarSign, CalendarCheck, TrendingUp } from "lucide-react";
// import axios from 'axios';
// import AdminSidebar from './AdminSidebar';

// const AdminDashboard = () => {
//   // 1. Quản lý State cho dữ liệu tổng và dữ liệu biểu đồ theo tháng
//   const [summary, setSummary] = useState({ totalRevenue: 0, totalBookings: 0 });
//   const [monthlyStats, setMonthlyStats] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const headers = { Authorization: `Bearer ${token}` };

//         // 2. Gọi song song cả 2 API: Tổng quát và Theo tháng
//         const [summaryRes, monthlyRes] = await Promise.all([
//           axios.get('/api/admin/reports/system', { headers }),
//           axios.get('/api/admin/reports/monthly', { headers }) // Endpoint mới mình đã hướng dẫn ở Service
//         ]);

//         setSummary(summaryRes.data);
//         setMonthlyStats(monthlyRes.data);
//       } catch (err) {
//         console.error("Lỗi khi lấy dữ liệu từ Database:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) return <div className="flex items-center justify-center min-h-screen">Đang tải dữ liệu thực tế...</div>;

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <AdminSidebar />

//       <main className="flex-1 p-8 space-y-8 overflow-y-auto">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Hệ Thống</h2>
//             <p className="text-slate-500">Dữ liệu được truy xuất trực tiếp từ hệ thống quản lý sân.</p>
//           </div>
//           <div className="flex items-center space-x-2">
//             <span className="px-3 py-1 text-sm bg-white border rounded-full shadow-sm text-slate-500 border-slate-200">
//               Cập nhật: {new Date().toLocaleTimeString('vi-VN')} {new Date().toLocaleDateString('vi-VN')}
//             </span>
//           </div>
//         </div>

//         {/* Thẻ KPI - Đã xóa các phần trăm % tăng trưởng ảo (hardcode) */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <Card className="border-none shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//               <CardTitle className="text-sm font-medium text-slate-600">Tổng Doanh Thu</CardTitle>
//               <DollarSign className="w-4 h-4 text-green-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-green-600">
//                 {summary.totalRevenue?.toLocaleString('vi-VN')} VNĐ
//               </div>
//               <p className="mt-1 text-xs text-slate-400">Dựa trên các đơn PAID/COMPLETED</p>
//             </CardContent>
//           </Card>

//           <Card className="border-none shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//               <CardTitle className="text-sm font-medium text-slate-600">Tổng Booking</CardTitle>
//               <CalendarCheck className="w-4 h-4 text-blue-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-blue-600">{summary.totalBookings} lượt</div>
//               <p className="mt-1 text-xs text-slate-400">Toàn bộ lịch sử đặt sân</p>
//             </CardContent>
//           </Card>

//           {/* Các thẻ phụ có thể tạm thời để trống hoặc lấy thêm data từ API nếu cần */}
//           <Card className="border-none shadow-sm opacity-50">
//             <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//               <CardTitle className="text-sm font-medium text-slate-600">Thông tin khác</CardTitle>
//               <Users className="w-4 h-4 text-purple-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-purple-600">--</div>
//               <p className="mt-1 text-xs text-slate-400">Đang cập nhật...</p>
//             </CardContent>
//           </Card>

//           <Card className="border-none shadow-sm opacity-50">
//             <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//               <CardTitle className="text-sm font-medium text-slate-600">Tỉ lệ lấp đầy</CardTitle>
//               <TrendingUp className="w-4 h-4 text-orange-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-orange-600">-- %</div>
//               <p className="mt-1 text-xs text-slate-400">Đang tính toán...</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Biểu đồ - Sử dụng monthlyStats từ Database */}
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
//           <Card className="border-none shadow-sm lg:col-span-4">
//             <CardHeader>
//               <CardTitle>Biểu đồ Doanh thu</CardTitle>
//               <CardDescription>Doanh thu thực tế theo từng tháng trong năm.</CardDescription>
//             </CardHeader>
//             <CardContent className="h-[350px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={monthlyStats}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
//                   <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`} />
//                   <Tooltip 
//                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
//                     formatter={(value) => [value.toLocaleString('vi-VN') + " VNĐ", "Doanh thu"]}
//                   />
//                   <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           <Card className="border-none shadow-sm lg:col-span-3">
//             <CardHeader>
//               <CardTitle>Số lượng Booking</CardTitle>
//               <CardDescription>Biến động lượt đặt sân qua các tháng.</CardDescription>
//             </CardHeader>
//             <CardContent className="h-[350px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={monthlyStats}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
//                   <YAxis fontSize={12} tickLine={false} axisLine={false} />
//                   <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
//                   <Line type="monotone" dataKey="bookings" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;














import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, DollarSign, CalendarCheck, TrendingUp } from "lucide-react";
import axios from 'axios';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
  // 1. Quản lý State khớp với DTO từ Backend
  const [summary, setSummary] = useState({ 
    totalRevenue: 0, 
    totalBookings: 0, 
    newUsers: 0, 
    occupancyRate: 0 
  });
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Gọi song song cả 2 API: Tổng quát và Theo tháng
        const [summaryRes, monthlyRes] = await Promise.all([
          axios.get('/api/admin/reports/system', { headers }),
          axios.get('/api/admin/reports/monthly', { headers })
        ]);

        setSummary(summaryRes.data);
        setMonthlyStats(monthlyRes.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu từ Database:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Đang tải dữ liệu thực tế...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* <AdminSidebar /> */}

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Hệ Thống</h2>
            <p className="text-slate-500">Dữ liệu thực tế từ hệ thống quản lý sân.</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 text-sm bg-white border rounded-full shadow-sm text-slate-500 border-slate-200">
              Cập nhật: {new Date().toLocaleTimeString('vi-VN')} {new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>

        {/* 4 Thẻ KPI - Đã map dữ liệu thực tế từ Backend */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-shadow border-none shadow-sm hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">Tổng Doanh Thu</CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {summary.totalRevenue?.toLocaleString('vi-VN')} VNĐ
              </div>
              <p className="mt-1 text-xs text-slate-400">Dựa trên đơn PAID/COMPLETED</p>
            </CardContent>
          </Card>

          <Card className="transition-shadow border-none shadow-sm hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">Tổng Booking</CardTitle>
              <CalendarCheck className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{summary.totalBookings} lượt</div>
              <p className="mt-1 text-xs text-slate-400">Tất cả thời gian</p>
            </CardContent>
          </Card>

          <Card className="transition-shadow border-none shadow-sm hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">Người Dùng Mới</CardTitle>
              <Users className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">+{summary.newUsers}</div>
              <p className="mt-1 text-xs text-slate-400">Đăng ký trong tháng này</p>
            </CardContent>
          </Card>

          <Card className="transition-shadow border-none shadow-sm hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">Tỉ lệ lấp đầy</CardTitle>
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{summary.occupancyRate}%</div>
              <p className="mt-1 text-xs text-slate-400">Hiệu suất khai thác tháng này</p>
            </CardContent>
          </Card>
        </div>

        {/* Biểu đồ - Sử dụng monthlyStats từ Database */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="border-none shadow-sm lg:col-span-4">
            <CardHeader>
              <CardTitle>Biểu đồ Doanh thu</CardTitle>
              <CardDescription>Doanh thu theo từng tháng (VNĐ)</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [value.toLocaleString('vi-VN') + " VNĐ", "Doanh thu"]}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm lg:col-span-3">
            <CardHeader>
              <CardTitle>Lượng Booking</CardTitle>
              <CardDescription>Số lượt đặt sân theo tháng</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#ef4444' }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
