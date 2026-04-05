import React, { useState, useEffect } from "react";
import http from "../api/http";
import { 
  FiBookOpen, FiUsers, FiUser, FiMapPin, FiCalendar, 
  FiSettings, FiCheckCircle, FiActivity, FiClock
} from "react-icons/fi";

const Dashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    groups: 0,
    professors: 0,
    students: 0,
    rooms: 0,
    activeSemesters: 0
  });

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from the database via Gateway
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          http.get('/dashboard/stats'),
          http.get('/dashboard/activities')
        ]);
        setStats(statsRes.data);
        setActivities(activitiesRes.data);
      } catch (err) {
        console.error("Failed to fetch live dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const statCards = [
    { title: "Kurse Totale", value: stats.courses, icon: <FiBookOpen className="text-blue-600 text-xl" />, bg: "bg-blue-50" },
    { title: "Grupe Studimi", value: stats.groups, icon: <FiUsers className="text-emerald-600 text-xl" />, bg: "bg-emerald-50" },
    { title: "Profesorë", value: stats.professors, icon: <FiUser className="text-purple-600 text-xl" />, bg: "bg-purple-50" },
    { title: "Përdorues", value: stats.students, icon: <FiUser className="text-amber-600 text-xl" />, bg: "bg-amber-50" },
    { title: "Dhoma", value: stats.rooms, icon: <FiMapPin className="text-rose-600 text-xl" />, bg: "bg-rose-50" },
    { title: "Semestra", value: stats.activeSemesters, icon: <FiCalendar className="text-indigo-600 text-xl" />, bg: "bg-indigo-50" }
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Përmbledhja e Sistemit</h1>
        <p className="text-slate-500 mt-1">Shikoni statistikat dhe menaxhoni aktivitetet për semestrin aktual.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center"
          >
            <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-3xl font-bold text-slate-800 mb-1">
              {loading ? (
                <span className="inline-block w-6 h-6 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin"></span>
              ) : stat.value}
            </p>
            <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
          </div>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Veprimet e shpejta & Aktivitetet */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Menaxhimi i Shpejtë</h2>
              <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                Krijo të re <FiSettings className="ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Shto Kurs", icon: <FiBookOpen className="text-2xl mb-2" /> },
                { label: "Krijo Grup", icon: <FiUsers className="text-2xl mb-2" /> },
                { label: "Cakto Orar", icon: <FiCalendar className="text-2xl mb-2" /> },
                { label: "Shto Profesor", icon: <FiUser className="text-2xl mb-2" /> }
              ].map((action, idx) => (
                <button 
                  key={idx}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                >
                  {action.icon}
                  <span className="font-medium text-sm">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-800">Aktivitetet e fundit</h2>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Sot</span>
            </div>
            
            <div className="space-y-4">
              {activities.length === 0 && !loading && (
                <p className="text-slate-500 text-sm py-4">Nuk ka aktivitete të fundit.</p>
              )}
              {activities.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100 text-blue-600`}>
                    <FiActivity />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                    <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <FiClock className="text-xs" /> {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statusi i Sistemit */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Statusi i Sistemit</h2>
            
            <div className="space-y-4">
              {[
                { name: "Server Status", status: "Online", statusColor: "text-emerald-600" },
                { name: "Database", status: "Active", statusColor: "text-emerald-600" },
                { name: "API Gateway", status: "Running", statusColor: "text-emerald-600" },
                { name: "Sync Status", status: "Live", statusColor: "text-blue-600" },
              ].map((sys, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-600 text-sm font-medium">{sys.name}</span>
                  <span className={`text-xs font-bold ${sys.statusColor} flex items-center gap-1.5`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {sys.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-blue-900 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
              <FiCheckCircle className="text-xl" />
            </div>
            <h3 className="text-base font-bold mb-2">Gjithçka po funksionon shkëlqyeshëm</h3>
            <p className="text-blue-700 text-sm leading-relaxed mb-4">
              Sistemi juaj është i përditësuar. Nuk ka asnjë konflikt në orarin e sotëm të leksioneve.
            </p>
            <button className="bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors w-full">
              Shiko Raportin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;