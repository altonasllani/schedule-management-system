// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    groups: 0,
    professors: 0,
    students: 0,
    rooms: 0,
    activeSemesters: 0
  });

  // Simulojmë loading të të dhënave
  useEffect(() => {
    // Në realitet, kjo do të ishte një API call
    setTimeout(() => {
      setStats({
        courses: 24,
        groups: 12,
        professors: 18,
        students: 320,
        rooms: 15,
        activeSemesters: 2
      });
    }, 500);
  }, []);

  const statCards = [
    { title: 'Kurse totale', value: stats.courses, color: 'bg-blue-500', icon: '📚' },
    { title: 'Grupe', value: stats.groups, color: 'bg-green-500', icon: '👥' },
    { title: 'Profesorë', value: stats.professors, color: 'bg-purple-500', icon: '👨‍🏫' },
    { title: 'Studenti', value: stats.students, color: 'bg-yellow-500', icon: '🎓' },
    { title: 'Dhoma', value: stats.rooms, color: 'bg-red-500', icon: '🏫' },
    { title: 'Semestra aktive', value: stats.activeSemesters, color: 'bg-indigo-500', icon: '📅' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Mirësevini në Sistemin e Menaxhimit të Orave
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts/Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Aktivitetet e fundit</h2>
            <ul className="space-y-3">
              {[
                { action: 'Kursi i ri u shtua', time: '10 minuta më parë', user: 'Admin' },
                { action: 'Orari u përditësua', time: '45 minuta më parë', user: 'Prof. Smith' },
                { action: 'Grupi i ri u krijuar', time: '1 orë më parë', user: 'Admin' },
                { action: 'Profesor i ri u shtua', time: '2 orë më parë', user: 'Admin' }
              ].map((activity, index) => (
                <li key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time} • {activity.user}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Veprimet e shpejta</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Shto Kurs', icon: '➕', color: 'bg-blue-100 text-blue-600' },
                { label: 'Krijo Grup', icon: '👥', color: 'bg-green-100 text-green-600' },
                { label: 'Cakto Orar', icon: '📅', color: 'bg-purple-100 text-purple-600' },
                { label: 'Shto Profesor', icon: '👨‍🏫', color: 'bg-yellow-100 text-yellow-600' }
              ].map((action, index) => (
                <button
                  key={index}
                  className={`${action.color} p-4 rounded-lg flex flex-col items-center justify-center hover:opacity-90 transition-opacity`}
                >
                  <span className="text-2xl mb-2">{action.icon}</span>
                  <span className="font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Statusi i Sistemit</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Server Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Database</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">API</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Running
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;