import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import HomePage from './pages/Home/Home'
import Login from './pages/Login/Login'
import { PitchDetail } from './pages/PitchDetail/PitchDetail'
import { Profile } from './pages/Profile/Profile'
import Register from './pages/Register/Register'
import OwnerManagement from './pages/OwnerManagement/OwnerManagement'
import AdminPendingFields from './pages/Admin/AdminPendingFields'
import AdminDashboard from './pages/Admin/AdminDashboard'
import UserManagement from './pages/Admin/UserManagement'

// --- LỚP BẢO VỆ ADMIN ---
const AdminRoute = ({ children }) => {
  // Lấy token và role từ localStorage (nhớ check đúng tên key Lợi đã lưu khi Login)
  const token = localStorage.getItem('token'); 
  const userRole = localStorage.getItem('role'); 

  // Nếu không có token hoặc role không phải ADMIN, đá về trang login
  if (!token || userRole !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Các route công khai */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pitch/:id" element={<PitchDetail />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Route dành cho Chủ sân (Owner) */}
        <Route path="/owner-management" element={<OwnerManagement />} />

        {/* --- KHU VỰC ADMIN (Đã được bảo vệ) --- */}
        <Route 
          path="/admin/fields/pending" 
          element={<AdminRoute><AdminPendingFields /></AdminRoute>} 
        />
        <Route 
          path="/admin/dashboard" 
          element={<AdminRoute><AdminDashboard /></AdminRoute>} 
        />
        <Route 
          path="/admin/users" 
          element={<AdminRoute><UserManagement /></AdminRoute>} 
        />

      </Routes>
    </Router>
  )
}

export default App