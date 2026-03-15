
import './App.css'
import { Home } from './pages/Home/Home'

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={Home}></Route>
        
      </Routes>
    </Router>
  )
}

export default App
