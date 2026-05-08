
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import HomePage from './pages/Home/Home'
import Login from './pages/Login/Login'
import { PitchDetail } from './pages/PitchDetail/PitchDetail'
import { Payment } from './pages/Payment/Payment'
import { Profile } from './pages/Profile/Profile'
import Register from './pages/Register/Register'
import OwnerManagement from './pages/OwnerManagement/OwnerManagement'
import AdminPendingFields from './pages/Admin/AdminPendingFields'
import Search from './pages/Search/Search'
import AdminDashboard from './pages/Admin/AdminDashboard'
import UserManagement from './pages/Admin/UserManagement'
import AdminConfig from './pages/Admin/AdminConfig'
import FinanceDashboard from './pages/Admin/FinanceDashboard'
import AdminNotification from './pages/Admin/AdminNotification'
import AdminLayout from './pages/Admin/AdminLayout'
import PaymentResult from './pages/Payment/PaymentResult'

const OwnerRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')

  if (!token || userRole !== 'OWNER') {
    return <Navigate to="/" replace />
  }

  return children
}

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')

  if (!token || userRole !== 'ADMIN') {
    return <Navigate to="/login" replace />
  }

  return children
}

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pitch/:id" element={<PitchDetail />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<AuthRoute><Profile /></AuthRoute>} />
        
        <Route path="/owner-management" element={<OwnerRoute><OwnerManagement /></OwnerRoute>} />
        <Route path="/search" element={<Search />} />

        {/* --- ADMIN --- */}
        <Route 
          path="/admin" 
          element={<AdminRoute><AdminLayout /></AdminRoute>}
        >
          
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="fields/pending" element={<AdminPendingFields />} />
          <Route path="config" element={<AdminConfig />} />
          <Route path="finance" element={<FinanceDashboard />} />
          <Route path="notifications" element={<AdminNotification />} />
          
         
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>


        <Route path="/payment-result" element={<PaymentResult />} />
      </Routes>
    </Router>
  )
}

export default App



