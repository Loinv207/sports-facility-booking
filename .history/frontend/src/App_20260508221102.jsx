// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import './App.css'
// import HomePage from './pages/Home/Home'
// import Login from './pages/Login/Login'
// import { PitchDetail } from './pages/PitchDetail/PitchDetail'
// import { Payment } from './pages/Payment/Payment'
// import { Profile } from './pages/Profile/Profile'
// import Register from './pages/Register/Register'
// import OwnerManagement from './pages/OwnerManagement/OwnerManagement'
// import AdminPendingFields from './pages/Admin/AdminPendingFields'
// import Search from './pages/Search/Search'
// import AdminDashboard from './pages/Admin/AdminDashboard'
// import UserManagement from './pages/Admin/UserManagement'
// import AdminConfig from './pages/Admin/AdminConfig'
// import FinanceDashboard from './pages/Admin/FinanceDashboard'
// import AdminNotification from './pages/Admin/AdminNotification'
// import PaymentSuccess from './pages/Payment/PaymentSuccess'

// const OwnerRoute = ({ children }) => {
//   const token = localStorage.getItem('token')
//   const userRole = localStorage.getItem('role')

//   if (!token || userRole !== 'OWNER') {
//     return <Navigate to="/" replace />
//   }

//   return children
// }

// const AdminRoute = ({ children }) => {
//   const token = localStorage.getItem('token')
//   const userRole = localStorage.getItem('role')

//   if (!token || userRole !== 'ADMIN') {
//     return <Navigate to="/login" replace />
//   }

//   return children
// }

// const AuthRoute = ({ children }) => {
//   const token = localStorage.getItem('token')

//   if (!token) {
//     return <Navigate to="/login" replace />
//   }

//   return children
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
        
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/pitch/:id" element={<PitchDetail />} />
//         <Route path="/payment" element={<Payment />} />
//         <Route path="/profile" element={<AuthRoute><Profile /></AuthRoute>} />
        
//         {/* Route dành cho Chủ sân (Owner) */}
//         <Route path="/owner-management" element={<OwnerRoute><OwnerManagement /></OwnerRoute>} />
//         <Route path="/search" element={<Search />} />

//         {/* --- ADMIN --- */}
//         <Route 
//           path="/admin/fields/pending" 
//           element={<AdminRoute><AdminPendingFields /></AdminRoute>} 
//         />
//         <Route 
//           path="/admin/dashboard" 
//           element={<AdminRoute><AdminDashboard /></AdminRoute>} 
//         />
//         <Route 
//           path="/admin/users" 
//           element={<AdminRoute><UserManagement /></AdminRoute>} 
//         />
//         <Route 
//           path="/admin/config" 
//           element={<AdminRoute><AdminConfig /></AdminRoute>} 
//         />
//         <Route 
//           path="/admin/finance" 
//           element={<AdminRoute><FinanceDashboard /></AdminRoute>} 
//         />
//         <Route 
//           path="/admin/notifications" 
//           element={<AdminRoute><AdminNotification /></AdminRoute>} 
//         />


//         <Route path="/payment-success" element={<PaymentSuccess />} />
//       </Routes>
//     </Router>
//   )
// }

// export default App




