import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [reportData, setReportData] = useState({ revenue: 0, bookings: 0 });

  useEffect(() => {
    // Gọi API Backend mà Lợi vừa làm xong
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('admin_token'); // Lấy token đã lưu khi login
        const res = await axios.get('http://localhost:8080/api/admin/reports/system', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReportData(res.data);
      } catch (err) {
        console.error("Lỗi lấy báo cáo:", err);
      }
    };
    fetchReport();
  }, []);

  // Dữ liệu cho Biểu đồ Doanh thu (Bar Chart)
  const revenueData = {
    labels: ['Tổng doanh thu hệ thống'],
    datasets: [
      {
        label: 'VND',
        data: [reportData.totalRevenue],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  // Dữ liệu cho Biểu đồ Booking (Line Chart)
  const bookingData = {
    labels: ['Hiện tại'],
    datasets: [
      {
        label: 'Số lượng Bookings',
        data: [reportData.totalBookings],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: true,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ width: '45%', minWidth: '300px' }}>
          <h3>Biểu đồ Doanh thu</h3>
          <Bar data={revenueData} />
        </div>

        <div style={{ width: '45%', minWidth: '300px' }}>
          <h3>Tăng trưởng Bookings</h3>
          <Line data={bookingData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;