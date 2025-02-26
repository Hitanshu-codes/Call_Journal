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
  const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? "http://localhost:5000"
    : "https://call-journal.onrender.com";

  console.log("API Base URL:", API_BASE_URL);

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/user`, { credentials: "include" })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        return res.json();
      })
      .then(data => {
        console.log("Fetched user data:", data);
        setUser(data);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  }, [API_BASE_URL])

  const logout = () => {
    window.location.href = `${API_BASE_URL}/auth/logout`;
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

