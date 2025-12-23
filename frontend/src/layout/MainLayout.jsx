// src/layout/MainLayout.jsx
import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/courses', label: 'Courses', icon: '📚' },
    { path: '/groups', label: 'Groups', icon: '👥' },
    { path: '/professors', label: 'Professors', icon: '👨‍🏫' },
    { path: '/rooms', label: 'Rooms', icon: '🏫' },
    { path: '/semesters', label: 'Semesters', icon: '📅' },
    { path: '/audit-logs', label: 'Audit Logs', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📅</div>
              <h1 className="text-xl font-bold text-gray-800">
                Schedule Management System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Admin Panel
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white min-h-[calc(100vh-73px)] border-r">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Menu
            </h2>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet /> {/* Kjo shfaq Dashboard-in ose faqet e tjera */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;