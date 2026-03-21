
import './App.css'
import { Home } from './pages/Home/Home'

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pitch/:id" element={<PitchDetail />} />

        
      </Routes>
    </Router>
  )
}

export default App
