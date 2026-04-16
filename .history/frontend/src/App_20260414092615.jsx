import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import { PitchDetail } from './pages/PitchDetail/PitchDetail'
import { Profile } from './pages/Profile/Profile'
import Register from './pages/Register/Register'
import OwnerManagement from './pages/OwnerManagement/OwnerManagement'
import HomePage from './pages/Home/Home'; // Trang chủ (done)
import PitchDetail from './pages/PitchDetail/PitchDetail'
import Profile from './pages/Profile/Profile'
import Register from './pages/Register/Register'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pitch/:id" element={<PitchDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/owner-management" element={<OwnerManagement />} />
      </Routes>
    </Router>
  )
}

export default App