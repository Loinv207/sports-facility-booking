import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Thêm dòng này
import './App.css'
import HomePage from './pages/Home/Home'; // Trang chủ (done)
import Login from './pages/login/Login'
import PitchDetail from './pages/PitchDetail/PitchDetail'
import Profile from './pages/Profile/Profile'
import Register from './pages/Register/Register'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pitch/:id" element={<PitchDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App