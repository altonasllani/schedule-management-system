import React, { useState, useEffect } from "react";
import http from "../api/http";
import {
  FiBookOpen,
  FiUsers,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiSettings,
  FiCheckCircle,
  FiActivity,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";

const Dashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    groups: 0,
    professors: 0,
    students: 0,
    rooms: 0,
    activeSemesters: 0,
  });

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          http.get("/dashboard/stats"),
          http.get("/dashboard/activities"),
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
    { title: "Kurse Totale", value: stats.courses, icon: <FiBookOpen />, color: "blue" },
    { title: "Grupe Studimi", value: stats.groups, icon: <FiUsers />, color: "emerald" },
    { title: "Profesorë", value: stats.professors, icon: <FiUser />, color: "purple" },
    { title: "Përdorues", value: stats.students, icon: <FiUser />, color: "amber" },
    { title: "Dhoma", value: stats.rooms, icon: <FiMapPin />, color: "rose" },
    { title: "Semestra", value: stats.activeSemesters, icon: <FiCalendar />, color: "indigo" },
  ];

  const getColorClasses = (color) => {
    const classes = {
      blue: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30 group-hover:shadow-blue-500/20",
      emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30 group-hover:shadow-emerald-500/20",
      purple: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20 border-purple-200 dark:border-purple-500/30 group-hover:shadow-purple-500/20",
      amber: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/30 group-hover:shadow-amber-500/20",
      rose: "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/20 border-rose-200 dark:border-rose-500/30 group-hover:shadow-rose-500/20",
      indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/30 group-hover:shadow-indigo-500/20",
    };
    return classes[color];
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Përmbledhja e Sistemit</h1>
          <p className="page-subtitle">
            Shikoni statistikat dhe menaxhoni aktivitetet për semestrin aktual.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm flex items-center gap-2">
          <FiCalendar className="text-emerald-500" />
          {new Date().toLocaleDateString("sq-AL", { month: "long", day: "numeric", year: "numeric" })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="card p-5 !rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group cursor-default"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 ${getColorClasses(stat.color)} border`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-1 tracking-tight">
              {loading ? (
                <span className="inline-block w-6 h-6 border-2 border-slate-200 dark:border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
              ) : (
                stat.value
              )}
            </p>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.title}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <div className="card-header border-none mb-6">
              <div>
                <h2 className="card-title">Menaxhimi i Shpejtë</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veprimet më të përdorura për administrim.</p>
              </div>
              <button className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold hover:text-emerald-500 hover:underline flex items-center gap-1">
                Krijo të re <FiSettings className="ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Shto Kurs", icon: <FiBookOpen className="text-2xl mb-3 text-blue-500" /> },
                { label: "Krijo Grup", icon: <FiUsers className="text-2xl mb-3 text-emerald-500" /> },
                { label: "Cakto Orar", icon: <FiCalendar className="text-2xl mb-3 text-amber-500" /> },
                { label: "Shto Profesor", icon: <FiUser className="text-2xl mb-3 text-purple-500" /> },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:shadow-lg transition-all group"
                >
                  <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                    {action.icon}
                  </div>
                  <span className="font-semibold text-sm text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header border-b border-slate-100 dark:border-slate-700/50 pb-4 mb-6">
              <div>
                <h2 className="card-title">Aktivitetet e fundit</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ndryshimet e fundit në sistem.</p>
              </div>
              <span className="badge badge-info">Sot</span>
            </div>

            <div className="space-y-4">
              {loading && (
                <div className="space-y-3">
                  {[0, 1, 2].map((item) => (
                     <div key={item} className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                  ))}
                </div>
              )}

              {activities.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-3">
                    <FiActivity className="text-slate-400 dark:text-slate-500 text-2xl" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Nuk ka aktivitete të fundit.</p>
                </div>
              )}

              {!loading &&
                activities.map((item, idx) => (
                  <div
                    key={`${item.title}-${idx}`}
                    className="flex gap-4 items-start p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50 group"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 group-hover:scale-110 transition-transform">
                      <FiActivity />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{item.desc}</p>
                      <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1 font-medium">
                        <FiClock className="text-xs" /> {item.time}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card">
            <h2 className="card-title mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-4">
              Statusi i Sistemit
            </h2>

            <div className="space-y-4">
              {[
                { name: "Server Status", status: "Online", statusColor: "text-emerald-600 dark:text-emerald-400" },
                { name: "Database", status: "Active", statusColor: "text-emerald-600 dark:text-emerald-400" },
                { name: "API Gateway", status: "Running", statusColor: "text-emerald-600 dark:text-emerald-400" },
                { name: "Sync Status", status: "Live", statusColor: "text-blue-600 dark:text-blue-400" },
              ].map((sys) => (
                <div key={sys.name} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">{sys.name}</span>
                  <span className={`text-xs font-bold ${sys.statusColor} flex items-center gap-2`}>
                    <span className="w-2 h-2 rounded-full bg-current shadow-[0_0_8px_currentColor] animate-pulse" />
                    {sys.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card relative overflow-hidden border-emerald-200 dark:border-emerald-500/20 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 dark:from-emerald-500/10 to-teal-50 dark:to-teal-500/5 opacity-50 dark:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 border border-emerald-200 dark:border-emerald-500/30 shadow-lg shadow-emerald-500/10 dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <FiCheckCircle className="text-2xl" />
              </div>
              <h3 className="text-xl font-extrabold mb-2 text-slate-800 dark:text-slate-100 tracking-tight">Gjithçka po funksionon</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                Sistemi juaj është i përditësuar. Nuk ka asnjë konflikt në orarin e sotëm të leksioneve. Raportet tregojnë stabilitet makimal.
              </p>
              <button className="btn btn-primary w-full shadow-lg hover:shadow-xl dark:group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                Shiko Raportin e Detajuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
