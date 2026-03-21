
import './App.css'
import { Home } from './pages/Home/Home'
import { Login } from './pages/login/Login'
import { PitchDetail } from './pages/PitchDetail/PitchDetail'
import { Profile } from './pages/Profile/Profile'
import { Register } from './pages/Register/Register'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pitch/:id" element={<PitchDetail />} />

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
