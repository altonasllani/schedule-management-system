import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { 
  FiHome, FiBook, FiUsers, FiUser, FiMapPin, FiCalendar, 
  FiLogOut, FiMenu, FiX, FiMonitor
} from "react-icons/fi";

const MainLayout = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { name: "Kurset", icon: <FiBook />, path: "/courses" },
    { name: "Grupet", icon: <FiUsers />, path: "/groups" },
    { name: "Profesorët", icon: <FiUser />, path: "/professors" },
    { name: "Dhomat", icon: <FiMapPin />, path: "/rooms" },
    { name: "Orari", icon: <FiCalendar />, path: "/semesters" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-inter flex flex-col md:flex-row">
      
      {/* Mobile Topbar */}
      <div className="md:hidden bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-2 font-bold text-lg">
          <FiMonitor className="text-blue-600" />
          Schedule System
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {isSidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:relative z-40 w-64 h-full min-h-screen bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 md:flex-shrink-0 shadow-sm md:shadow-none`}
      >
        <div className="h-16 hidden md:flex items-center px-6 border-b border-slate-200 text-lg font-bold gap-2">
          <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center">
            <FiMonitor className="text-sm" />
          </div>
          <span>Schedule System</span>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={idx}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className={`text-lg ${isActive ? "text-blue-600" : "text-slate-400"}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border border-slate-300">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name || "Përdorues"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || "user@domain.com"}</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="text-lg" />
            Kthehu te Login
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-4rem)] md:h-screen bg-slate-50">
        <div className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-end px-6 sticky top-0 z-10 w-full">
          <div className="text-sm text-slate-500">
            {new Date().toLocaleDateString('sq-AL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;