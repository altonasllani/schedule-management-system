import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import http from "../api/http";
import {
  FiActivity,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiMapPin,
  FiSettings,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";

const SESSIONS_API = "/catalog1/sessions";

const weekDays = [
  { id: 1, short: "Hën", label: "E Hënë" },
  { id: 2, short: "Mar", label: "E Martë" },
  { id: 3, short: "Mër", label: "E Mërkurë" },
  { id: 4, short: "Enj", label: "E Enjte" },
  { id: 5, short: "Pre", label: "E Premte" },
  { id: 6, short: "Sht", label: "E Shtunë" },
  { id: 7, short: "Die", label: "E Diel" },
];

const formatTime = (time) => (time ? String(time).slice(0, 5) : "--:--");
const percentClass = (prefix, value) => `${prefix}-${Math.max(0, Math.min(100, Math.round(value)))}`;

const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const fromIsoDate = (isoDate) => {
  const [year, month, day] = String(isoDate).split("-").map(Number);
  return new Date(year, month - 1, day);
};

const shiftIsoDate = (isoDate, amount) => {
  const nextDate = fromIsoDate(isoDate);
  nextDate.setDate(nextDate.getDate() + amount);
  return toIsoDate(nextDate);
};

const Dashboard = () => {
  const calendarRef = useRef(null);

  const [currentDateIso, setCurrentDateIso] = useState(() => toIsoDate(new Date()));
  const [stats, setStats] = useState({
    courses: 0,
    groups: 0,
    professors: 0,
    students: 0,
    rooms: 0,
    activeSemesters: 0,
  });
  const [activities, setActivities] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => toIsoDate(new Date()));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        http.get("/dashboard/stats"),
        http.get("/dashboard/activities"),
      ]);
      setStats(statsRes.data);
      setActivities(Array.isArray(activitiesRes.data) ? activitiesRes.data : []);
    } catch (err) {
      console.error("Failed to fetch live dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleData = async () => {
    setScheduleLoading(true);
    try {
      const res = await http.get(SESSIONS_API);
      setSessions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch schedule sessions:", err);
      setSessions([]);
    } finally {
      setScheduleLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchScheduleData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const scheduleNextMidnightUpdate = () => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0);

      return window.setTimeout(() => {
        const nextIsoDate = toIsoDate(new Date());

        setCurrentDateIso((previousIso) => {
          setSelectedDate((previousSelectedDate) =>
            previousSelectedDate === previousIso ? nextIsoDate : previousSelectedDate
          );
          return nextIsoDate;
        });
      }, nextMidnight.getTime() - now.getTime() + 1000);
    };

    const timeoutId = scheduleNextMidnightUpdate();
    return () => window.clearTimeout(timeoutId);
  }, [currentDateIso]);

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
      blue: "stat-color-blue",
      emerald: "stat-color-emerald",
      purple: "stat-color-purple",
      amber: "stat-color-amber",
      rose: "stat-color-rose",
      indigo: "stat-color-indigo",
    };
    return classes[color];
  };

  const totalStats = Object.values(stats).reduce((sum, value) => sum + Number(value || 0), 0);

  const statisticRows = statCards.map((stat) => {
    const value = Number(stat.value || 0);
    const percentage = totalStats > 0 ? Math.round((value / totalStats) * 100) : 0;

    return {
      ...stat,
      value,
      percentage,
      status: value > 0 ? "Aktiv" : "Pa të dhëna",
    };
  });

  const scheduleOverview = useMemo(() => {
    const dayRows = weekDays.map((day) => {
      const daySessions = sessions
        .filter((session) => Number(session.day_of_week) === day.id)
        .sort((a, b) => String(a.start_time || "").localeCompare(String(b.start_time || "")));

      return {
        ...day,
        sessions: daySessions,
        count: daySessions.length,
      };
    });

    const maxCount = Math.max(...dayRows.map((day) => day.count), 1);
    const busiestDay = dayRows.reduce((top, day) => (day.count > top.count ? day : top), dayRows[0]);
    const currentDate = fromIsoDate(currentDateIso);
    const todayId = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
    const today = dayRows.find((day) => day.id === todayId) || dayRows[0];

    return { dayRows, maxCount, busiestDay, today };
  }, [currentDateIso, sessions]);

  const selectedDateValue = useMemo(() => fromIsoDate(selectedDate), [selectedDate]);
  const selectedDayId = selectedDateValue.getDay() === 0 ? 7 : selectedDateValue.getDay();
  const selectedDaySchedule =
    scheduleOverview.dayRows.find((day) => day.id === selectedDayId) || scheduleOverview.today;
  const isTodaySelected = selectedDate === currentDateIso;

  const selectedDateLabel = selectedDateValue.toLocaleDateString("sq-AL", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const selectedDateShort = selectedDateValue.toLocaleDateString("sq-AL", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const quickActions = [
    {
      label: "Shto Kurs",
      icon: <FiBookOpen className="quick-blue" />,
      path: "/courses",
    },
    { label: "Krijo Grup", icon: <FiUsers className="quick-emerald" />, path: "/groups" },
    { label: "Cakto Orar", icon: <FiCalendar className="quick-amber" />, path: "/timetable" },
    { label: "Shto Profesor", icon: <FiUser className="quick-purple" />, path: "/professors" },
  ];

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div className="dashboard-header-copy">
          <h1 className="page-title">Përmbledhja e Sistemit</h1>
          <p className="page-subtitle">
            Shikoni statistikat dhe menaxhoni aktivitetet për semestrin aktual.
          </p>
        </div>

        <div className="dashboard-date-wrap" ref={calendarRef}>
          <button
            type="button"
            className="dashboard-date dashboard-date-button"
            onClick={() => setIsCalendarOpen((open) => !open)}
            aria-expanded={isCalendarOpen}
            aria-label="Hap kalendarin"
          >
            <FiCalendar className="icon-emerald" />
            <span>{selectedDateShort}</span>
            <FiChevronDown className={`dashboard-date-chevron ${isCalendarOpen ? "dashboard-date-chevron-open" : ""}`} />
          </button>

          {isCalendarOpen && (
            <div className="dashboard-calendar-popover">
              <div className="dashboard-calendar-head">
                <div>
                  <p className="dashboard-calendar-label">Data e zgjedhur</p>
                  <p className="dashboard-calendar-value">{selectedDateLabel}</p>
                </div>
                <button
                  type="button"
                  className="dashboard-calendar-close"
                  onClick={() => setIsCalendarOpen(false)}
                  aria-label="Mbyll kalendarin"
                >
                  <FiX />
                </button>
              </div>

              <div className="dashboard-calendar-nav">
                <button
                  type="button"
                  className="dashboard-calendar-shift"
                  onClick={() => setSelectedDate((current) => shiftIsoDate(current, -1))}
                  aria-label="Dita paraprake"
                >
                  <FiChevronLeft />
                </button>

                <input
                  type="date"
                  className="dashboard-calendar-input"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />

                <button
                  type="button"
                  className="dashboard-calendar-shift"
                  onClick={() => setSelectedDate((current) => shiftIsoDate(current, 1))}
                  aria-label="Dita tjetër"
                >
                  <FiChevronRight />
                </button>
              </div>

              <div className="dashboard-calendar-actions">
                <button
                  type="button"
                  className="dashboard-calendar-action dashboard-calendar-action-muted"
                  onClick={() => setSelectedDate(currentDateIso)}
                >
                  Sot
                </button>
                <button
                  type="button"
                  className="dashboard-calendar-action dashboard-calendar-action-primary"
                  onClick={() => setIsCalendarOpen(false)}
                >
                  Apliko
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-stats">
        {statCards.map((stat) => (
          <div key={stat.title} className="dashboard-stat-card">
            <div className="dashboard-stat-icon-wrap">
              <div className={`dashboard-stat-icon ${getColorClasses(stat.color)}`}>{stat.icon}</div>
            </div>
            <p className="dashboard-stat-value">{loading ? <span className="dashboard-spinner" /> : stat.value}</p>
            <h3 className="dashboard-stat-title">{stat.title}</h3>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <div className="crud-card dashboard-panel">
            <div className="dashboard-panel-header">
              <div className="card-header-tight">
                <div>
                  <h2 className="card-title">Tabela e Statistikave</h2>
                  <p className="section-note">Përmbledhje numerike e moduleve kryesore në sistem.</p>
                </div>
                <span className="badge badge-info">{totalStats} rekorde</span>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="stats-detail-grid">
                <div className="chart-panel">
                  <div className="chart-header">
                    <div>
                      <p className="metric-label">Ngarkesa e Orarit</p>
                      <h3 className="metric-value">{scheduleLoading ? "..." : `${sessions.length} seanca`}</h3>
                    </div>
                    <span className="badge-inline">
                      <FiClock />
                      Java
                    </span>
                  </div>

                  <div className="chart-box">
                    <div className="chart-grid">
                      {scheduleOverview.dayRows.map((day) => {
                        const height =
                          day.count > 0 ? Math.max(18, (day.count / scheduleOverview.maxCount) * 100) : 8;

                        return (
                          <div key={day.id} className="chart-day">
                            <div className="chart-bar-wrap">
                              <div
                                className={`chart-bar ${percentClass("h-pct", height)} ${
                                  day.count > 0 ? "chart-bar-active" : "chart-bar-empty"
                                }`}
                              />
                              <span className="chart-count">{scheduleLoading ? "-" : day.count}</span>
                            </div>
                            <span className="chart-day-label">{day.short}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="chart-footnote">
                    <span className="chart-footnote-label">Dita më e ngarkuar:</span>
                    <span className="badge badge-success">
                      {scheduleLoading
                        ? "Duke ngarkuar"
                        : `${scheduleOverview.busiestDay.label} · ${scheduleOverview.busiestDay.count} seanca`}
                    </span>
                  </div>
                </div>

                <div className="today-panel">
                  <div className="today-header">
                    <div>
                      <p className="metric-label">
                        {isTodaySelected ? "Orari i sotëm" : "Orari për datën e zgjedhur"}
                      </p>
                      <h3 className="today-title">{selectedDaySchedule.label}</h3>
                    </div>
                    <span className="badge badge-info">{selectedDaySchedule.count} seanca</span>
                  </div>

                  <div className="today-list">
                    {scheduleLoading &&
                      [0, 1, 2].map((item) => <div key={item} className="today-skeleton" />)}

                    {!scheduleLoading &&
                      selectedDaySchedule.sessions.slice(0, 4).map((session) => (
                        <div key={session.id} className="today-session">
                          <div className="today-session-row">
                            <h4 className="today-session-title">{session.course_name || "Kurs pa emër"}</h4>
                            <span className="today-session-time">
                              {formatTime(session.start_time)}-{formatTime(session.end_time)}
                            </span>
                          </div>
                          <p className="today-session-meta">
                            {session.group_name || "Grup"} · {session.room_name || "Dhomë"} ·{" "}
                            {session.professor_name || "Profesor"}
                          </p>
                        </div>
                      ))}

                    {!scheduleLoading && selectedDaySchedule.sessions.length === 0 && (
                      <div className="empty-state">
                        <FiCalendar className="empty-icon" />
                        <p className="metric-label">
                          {isTodaySelected ? "Nuk ka orar për sot." : "Nuk ka orar për këtë datë."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-table-wrap">
              <div className="table-panel">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="table-th">Moduli</th>
                      <th className="table-th">Totali</th>
                      <th className="table-th">Pesha</th>
                      <th className="table-th-right">Statusi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statisticRows.map((row) => (
                      <tr key={row.title} className="table-tr">
                        <td className="table-td">
                          <div className="module-cell">
                            <div className={`module-icon ${getColorClasses(row.color)}`}>{row.icon}</div>
                            <span className="module-title">{row.title}</span>
                          </div>
                        </td>
                        <td className="table-td text-strong">{loading ? "..." : row.value}</td>
                        <td className="table-td weight-cell">
                          <div className="module-cell">
                            <div className="weight-track">
                              <div className={`weight-fill ${percentClass("w-pct", row.percentage)}`} />
                            </div>
                            <span className="chart-day-label">{loading ? "--" : `${row.percentage}%`}</span>
                          </div>
                        </td>
                        <td className="table-td-right">
                          <span className={`badge ${row.value > 0 ? "badge-success" : "badge-warning"}`}>
                            {loading ? "Duke ngarkuar" : row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header card-header-plain">
              <div>
                <h2 className="card-title">Menaxhimi i Shpejtë</h2>
                <p className="section-note">Veprimet më të përdorura për administrim.</p>
              </div>
              <Link to="/courses" className="quick-header-link">
                Krijo të re <FiSettings className="quick-link-icon" />
              </Link>
            </div>

            <div className="quick-grid">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.path} className="quick-action">
                  <div className="quick-action-icon-wrap">{action.icon}</div>
                  <span className="quick-action-text">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header card-header-bordered">
              <div>
                <h2 className="card-title">Aktivitetet e fundit</h2>
                <p className="section-note">Ndryshimet e fundit në sistem.</p>
              </div>
              <span className="badge badge-info">Sot</span>
            </div>

            <div className="activity-list">
              {loading && (
                <div className="today-list">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="activity-skeleton" />
                  ))}
                </div>
              )}

              {activities.length === 0 && !loading && (
                <div className="activity-empty">
                  <div className="activity-empty-icon">
                    <FiActivity className="activity-empty-icon-svg" />
                  </div>
                  <p className="activity-empty-text">Nuk ka aktivitete të fundit.</p>
                </div>
              )}

              {!loading &&
                activities.map((item, idx) => (
                  <div key={`${item.title}-${idx}`} className="activity-item">
                    <div className="activity-icon">
                      <FiActivity />
                    </div>
                    <div>
                      <h4 className="activity-title">{item.title}</h4>
                      <p className="activity-desc">{item.desc}</p>
                      <span className="activity-time">
                        <FiClock className="clock-tiny" /> {item.time}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="dashboard-side">
          <div className="card">
            <h2 className="system-card-title">Statusi i Sistemit</h2>

            <div className="today-list">
              {[
                { name: "Server Status", status: "Online", statusColor: "status-emerald" },
                { name: "Database", status: "Active", statusColor: "status-emerald" },
                { name: "API Gateway", status: "Running", statusColor: "status-emerald" },
                { name: "Sync Status", status: "Live", statusColor: "status-blue" },
              ].map((sys) => (
                <div key={sys.name} className="system-row">
                  <span className="system-name">{sys.name}</span>
                  <span className={`system-status ${sys.statusColor}`}>
                    <span className="system-dot" />
                    {sys.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="health-card">
            <div className="health-bg" />
            <div className="health-content">
              <div className="health-icon">
                <FiCheckCircle className="icon-2xl" />
              </div>
              <h3 className="health-title">Gjithçka po funksionon</h3>
              <p className="health-text">
                Sistemi juaj është i përditësuar. Nuk ka asnjë konflikt në orarin e sotëm të leksioneve.
                Raportet tregojnë stabilitet maksimal.
              </p>
              <button className="health-button">Shiko Raportin e Detajuar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
