<<<<<<< Updated upstream
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";

// Krijo faqe të thjeshta për tani
const SimplePage = ({ title }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="mt-2 text-gray-600">Kjo faqe është në zhvillim.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Main layout with all pages */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<SimplePage title="Courses" />} />
          <Route path="/groups" element={<SimplePage title="Groups" />} />
          <Route path="/professors" element={<SimplePage title="Professors" />} />
          <Route path="/rooms" element={<SimplePage title="Rooms" />} />
          <Route path="/semesters" element={<SimplePage title="Semesters" />} />
          <Route path="/audit-logs" element={<SimplePage title="Audit Logs" />} />
        </Route>
      </Routes>
    </BrowserRouter>
=======
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import http from "./api/http";
import { FaCheckCircle, FaSignOutAlt } from "react-icons/fa";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in with token
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Get user data
        const res = await http.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        console.error("Token verification error:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* LOGIN/REGISTER */}
      <Route path="/login" element={<Login setUser={setUser} />} />

      {/* HOME PAGE - Main page after login */}
      <Route
        path="/"
        element={
          user ? (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 md:p-8">
              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-6 rounded-3xl bg-gray-800/50 border border-gray-700">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Welcome, <span className="text-emerald-400">{user.name}</span>!
                    </h1>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-gray-400">{user.email}</p>
                      <span className="px-3 py-1 rounded-full bg-gray-800 text-emerald-400 text-xs font-medium border border-gray-700">
                        {user.role || "Student"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300 border border-gray-700"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>

                {/* Success Message */}
                <div className="mb-8 p-6 rounded-3xl bg-emerald-900/30 border border-emerald-700/30">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center">
                      <FaCheckCircle className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Login Successful!</h2>
                      <p className="text-emerald-200">
                        You have successfully logged into Schedule System
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 rounded-3xl bg-gray-800/50 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-400 text-sm">ID:</span>
                        <p className="text-white font-mono">#{user.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Name:</span>
                        <p className="text-white">{user.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Email:</span>
                        <p className="text-emerald-400 break-all">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-emerald-900/30 border border-emerald-700/30">
                    <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-300 text-sm">Login Date:</span>
                        <p className="text-white">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-300 text-sm">Time:</span>
                        <p className="text-white">{new Date().toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-300 text-sm">Status:</span>
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/50 text-emerald-400 text-xs border border-emerald-700/50">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Welcome Message */}
                <div className="p-6 rounded-3xl bg-green-900/30 border border-green-700/30">
                  <p className="text-gray-300 text-center">
                    Welcome to our Schedule Management System!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* FALLBACK - redirect to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
>>>>>>> Stashed changes
  );
}

export default App;