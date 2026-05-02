
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Filler
// } from 'chart.js';
// import { Bar, Line } from 'react-chartjs-2';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { DollarSign, Percent, Wallet, ArrowUpRight } from 'lucide-react';
// import AdminSidebar from './AdminSidebar';

// ChartJS.register(
//   CategoryScale, LinearScale, BarElement, PointElement, 
//   LineElement, ArcElement, Title, Tooltip, Legend, Filler
// );

// const FinanceDashboard = () => {
//   const [financeData, setFinanceData] = useState(null);
//   const [monthlyStats, setMonthlyStats] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const headers = { Authorization: `Bearer ${token}` };

//         // Gọi đồng thời API Finance và API Monthly đã có ở ReportService
//         const [financeRes, monthlyRes] = await Promise.all([
//           axios.get('/api/admin/reports/finance', { headers }),
//           axios.get('/api/admin/reports/monthly', { headers })
//         ]);

//         setFinanceData(financeRes.data);
//         setMonthlyStats(monthlyRes.data); // Lấy data 12 tháng từ DB
//       } catch (error) {
//         console.error("Lỗi khi tải dữ liệu tài chính", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) return <div className="p-10 text-center">Đang kết nối hệ thống kế toán...</div>;

//   // Cấu hình Biểu đồ cột: So sánh Doanh thu và Hoa hồng 12 tháng
//   const barData = {
//     labels: monthlyStats.map(m => m.name),
//     datasets: [
//       {
//         label: 'Doanh thu tổng',
//         data: monthlyStats.map(m => m.revenue),
//         backgroundColor: 'rgba(59, 130, 246, 0.8)',
//         borderRadius: 4,
//       },
//       {
//         label: 'Hoa hồng (Ước tính)',
//         // Giả sử lấy doanh thu tháng * tỷ lệ hoa hồng để Admin thấy xu hướng thu nhập
//         data: monthlyStats.map(m => m.revenue * 0.1), 
//         backgroundColor: 'rgba(249, 115, 22, 0.8)',
//         borderRadius: 4,
//       },
//     ],
//   };

//   // Cấu hình Biểu đồ đường: Xu hướng tăng trưởng Booking thực tế
//   const lineData = {
//     labels: monthlyStats.map(m => m.name),
//     datasets: [
//       {
//         label: 'Số đơn hàng',
//         data: monthlyStats.map(m => m.bookings),
//         borderColor: '#10b981',
//         backgroundColor: 'rgba(16, 185, 129, 0.1)',
//         fill: true,
//         tension: 0.4,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: { legend: { position: 'bottom' } },
//     scales: {
//       y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
//       x: { grid: { display: false } }
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <AdminSidebar />
//       <main className="flex-1 p-8 space-y-8">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Báo Cáo Tài Chính</h1>
//           <p className="text-slate-500">Dữ liệu dòng tiền dựa trên các hóa đơn đã thanh toán thành công.</p>
//         </div>

//         {/* Thẻ KPI Tài Chính */}
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//           <Card className="border-none shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//               <CardTitle className="text-sm font-medium">Tổng doanh thu hệ thống</CardTitle>
//               <DollarSign className="w-4 h-4 text-blue-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-slate-900">
//                 {financeData.totalRevenue?.toLocaleString('vi-VN')} đ
//               </div>
//               <p className="mt-1 text-xs text-slate-400">Tổng giá trị đơn hàng PAID/COMPLETED</p>
//             </CardContent>
//           </Card>

//           <Card className="text-orange-700 border-none shadow-sm bg-orange-50/30">
//             <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//               <CardTitle className="text-sm font-medium">Hoa hồng hệ thống</CardTitle>
//               <Percent className="w-4 h-4" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{financeData.totalCommission?.toLocaleString('vi-VN')} đ</div>
//               <p className="mt-1 text-xs opacity-70">Phần trăm thu từ chủ sân</p>
//             </CardContent>
//           </Card>

//           <Card className="text-green-700 border-none shadow-sm bg-green-50/30">
//             <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//               <CardTitle className="text-sm font-medium">Thực nhận (Lợi nhuận)</CardTitle>
//               <Wallet className="w-4 h-4" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{financeData.netAmount?.toLocaleString('vi-VN')} đ</div>
//               <p className="mt-1 text-xs opacity-70">Tiền thực tế Admin nhận được</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Biểu đồ phân tích thực tế 12 tháng */}
//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
//           <Card className="border-none shadow-sm">
//             <CardHeader>
//               <CardTitle className="text-lg">Cơ cấu doanh thu năm {new Date().getFullYear()}</CardTitle>
//               <CardDescription>So sánh doanh thu và hoa hồng qua các tháng</CardDescription>
//             </CardHeader>
//             <CardContent className="h-[300px]">
//               <Bar data={barData} options={chartOptions} />
//             </CardContent>
//           </Card>

//           <Card className="border-none shadow-sm">
//             <CardHeader>
//               <CardTitle className="text-lg">Hiệu suất đơn hàng</CardTitle>
//               <CardDescription>Số lượng booking thành công hàng tháng</CardDescription>
//             </CardHeader>
//             <CardContent className="h-[300px]">
//               <Line data={lineData} options={chartOptions} />
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default FinanceDashboard;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Percent, Wallet, ArrowUpRight, Landmark } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, 
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
);

const FinanceDashboard = () => {
  const [financeData, setFinanceData] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Gọi đồng thời API Finance và API Monthly từ ReportService
        const [financeRes, monthlyRes] = await Promise.all([
          axios.get('/api/admin/reports/finance', { headers }),
          axios.get('/api/admin/reports/monthly', { headers })
        ]);

        setFinanceData(financeRes.data);
        setMonthlyStats(monthlyRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu tài chính", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Đang kết nối hệ thống kế toán...</div>;

  // Tính toán số tiền phải trả chủ sân (Tổng doanh thu - Hoa hồng)
  const totalPayout = (financeData?.totalRevenue || 0) - (financeData?.totalCommission || 0);

  // Cấu hình Biểu đồ cột: So sánh Doanh thu tổng và Lợi nhuận thực (Hoa hồng)
  const barData = {
    labels: monthlyStats.map(m => m.name),
    datasets: [
      {
        label: 'Doanh thu tổng',
        data: monthlyStats.map(m => m.revenue),
        backgroundColor: 'rgba(59, 130, 246, 0.5)', // Xanh nhạt cho tổng
        borderRadius: 4,
      },
      {
        label: 'Lợi nhuận Admin (Hoa hồng)',
        data: monthlyStats.map(m => m.revenue * 0.1), // Giả định phí sàn 10%
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // Xanh lá đậm cho tiền thực nhận
        borderRadius: 4,
      },
    ],
  };

  const lineData = {
    labels: monthlyStats.map(m => m.name),
    datasets: [
      {
        label: 'Số lượng đơn đặt sân',
        data: monthlyStats.map(m => m.bookings),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Báo Cáo Tài Chính</h1>
          <p className="text-slate-500">Quản lý doanh thu, hoa hồng hệ thống và công nợ đối tác.</p>
        </div>

        {/* Thẻ KPI Tài Chính Đã Hiệu Chỉnh Logic */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Thẻ 1: Tổng dòng tiền lưu thông */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Tổng giao dịch hệ thống</CardTitle>
              <DollarSign className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {financeData?.totalRevenue?.toLocaleString('vi-VN')} đ
              </div>
              <p className="mt-1 text-xs text-slate-400">Tổng giá trị đơn hàng đã thanh toán</p>
            </CardContent>
          </Card>

          {/* Thẻ 2: Tiền thực nhận của Admin */}
          <Card className="text-green-700 border-none shadow-sm bg-green-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Lợi nhuận Admin (Hoa hồng)</CardTitle>
              <Percent className="w-4 h-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financeData?.totalCommission?.toLocaleString('vi-VN')} đ
              </div>
              <p className="mt-1 text-xs opacity-80">Phí dịch vụ thực tế Admin bỏ túi</p>
            </CardContent>
          </Card>

          {/* Thẻ 3: Tiền của Chủ Sân */}
          <Card className="text-orange-700 border-none shadow-sm bg-orange-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Phải trả chủ sân</CardTitle>
              <Landmark className="w-4 h-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalPayout.toLocaleString('vi-VN')} đ
              </div>
              <p className="mt-1 text-xs opacity-80">Công nợ cần chuyển trả đối tác</p>
            </CardContent>
          </Card>
        </div>

        {/* Biểu đồ phân tích */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Tăng trưởng doanh thu & Lợi nhuận</CardTitle>
              <CardDescription>So sánh quy mô giao dịch và hoa hồng thu được</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Bar data={barData} options={chartOptions} />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Tần suất giao dịch</CardTitle>
              <CardDescription>Số lượng đơn hàng thành công theo tháng</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Line data={lineData} options={chartOptions} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FinanceDashboard;
