import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { UserProvider } from "./context/UserContext"
import { useEffect, useState } from "react"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import History from "./pages/History"
import MonthlySummary from "./pages/MonthlySummary"
import Settings from "./pages/Settings"
import Login from "./pages/Login"
import Toaster from "./components/Toaster"
import "./index.css"

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch("http://localhost:5000/auth/user", { credentials: "include" })
      .then(res => res.json())
      .then(data => setUser(data))
  }, [])

  const logout = () => {
    window.location.href = "http://localhost:3000/login"
  }

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />
    }
    return children
  }

  return (
    <UserProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
          <Navbar user={user} logout={logout} />
          <main className="container mx-auto p-4 flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/monthly-summary" element={<ProtectedRoute><MonthlySummary /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </UserProvider>
  )
}

export default App

