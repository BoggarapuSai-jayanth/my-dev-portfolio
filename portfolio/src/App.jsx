import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { AdminDashboard } from './pages/AdminDashboard'
import { Login } from './pages/Login'
import { usePortfolio } from './context/PortfolioContext'

function App() {
  const { isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )
}

export default App
