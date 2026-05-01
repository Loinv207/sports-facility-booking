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
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Percent, Wallet, TrendingUp } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FinanceDashboard = () => {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/reports/finance', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReportData(res.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
      }
    };
    fetchFinanceData();
  }, []);

  if (!reportData) return <div className="p-10 text-center">Đang tải báo cáo...</div>;

  const barData = {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [
      {
        label: 'Doanh thu tổng',
        data: [reportData.totalRevenue * 0.2, reportData.totalRevenue * 0.3, reportData.totalRevenue * 0.2, reportData.totalRevenue * 0.3],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 6,
      },
      {
        label: 'Hoa hồng hệ thống',
        data: [reportData.totalCommission * 0.2, reportData.totalCommission * 0.3, reportData.totalCommission * 0.2, reportData.totalCommission * 0.3],
        backgroundColor: 'rgba(249, 115, 22, 0.8)', 
        borderRadius: 6,
      },
    ],
  };

  const lineData = {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [
      {
        label: 'Thực nhận (Net)',
        data: [reportData.netAmount * 0.15, reportData.netAmount * 0.35, reportData.netAmount * 0.2, reportData.netAmount * 0.3],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4, 
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
        <p className="text-muted-foreground">Phân tích dòng tiền và hiệu quả kinh doanh của hệ thống.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalRevenue.toLocaleString()} đ</div>
            <p className="text-xs text-green-500 mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +5.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoa hồng (% hệ thống)</CardTitle>
            <Percent className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{reportData.totalCommission.toLocaleString()} đ</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lợi nhuận thực nhận</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{reportData.netAmount.toLocaleString()} đ</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1 shadow-md">
          <CardHeader>
            <CardTitle>Cơ cấu doanh thu</CardTitle>
            <CardDescription>So sánh doanh thu tổng và hoa hồng thu được</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar data={barData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-md">
          <CardHeader>
            <CardTitle>Xu hướng lợi nhuận</CardTitle>
            <CardDescription>Tăng trưởng thực nhận sau khi trừ phí</CardDescription>
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
