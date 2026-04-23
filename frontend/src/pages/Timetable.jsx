import React, { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiBarChart2,
  FiCalendar,
  FiChevronDown,
  FiEdit2,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiTrash2,
} from "react-icons/fi";
import http from "../api/http";
import Modal from "../components/Modal";

const API = {
  sessions: "/catalog1/sessions",
  courses: "/catalog1/courses",
  professors: "/catalog1/professors",
  groups: "/catalog2/groups",
  rooms: "/catalog2/rooms",
  semesters: "/catalog2/semesters",
};

const weekDays = [
  { id: 1, short: "Hën", label: "E Hënë" },
  { id: 2, short: "Mar", label: "E Martë" },
  { id: 3, short: "Mër", label: "E Mërkurë" },
  { id: 4, short: "Enj", label: "E Enjte" },
  { id: 5, short: "Pre", label: "E Premte" },
  { id: 6, short: "Sht", label: "E Shtunë" },
  { id: 7, short: "Die", label: "E Diel" },
];

const weekTypes = [
  { value: "all", label: "Çdo javë" },
  { value: "even", label: "Javë çift" },
  { value: "odd", label: "Javë tek" },
];

const emptyForm = {
  course_id: "",
  group_id: "",
  room_id: "",
  professor_id: "",
  semester_id: "",
  day_of_week: "1",
  start_time: "08:00",
  end_time: "10:00",
  week_type: "all",
};

const formatTime = (time) => (time ? String(time).slice(0, 5) : "--:--");
const percentClass = (prefix, value) => `${prefix}-${Math.max(0, Math.min(100, Math.round(value)))}`;
const dayName = (id) => weekDays.find((day) => day.id === Number(id))?.label || "Ditë";
const weekTypeLabel = (value) => weekTypes.find((type) => type.value === value)?.label || "Çdo javë";

const timesOverlap = (aStart, aEnd, bStart, bEnd) => {
  const startA = formatTime(aStart);
  const endA = formatTime(aEnd);
  const startB = formatTime(bStart);
  const endB = formatTime(bEnd);
  return startA < endB && startB < endA;
};

const weekTypesConflict = (a, b) => a === "all" || b === "all" || a === b;

const Timetable = () => {
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [selectedDay, setSelectedDay] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    setError("");

    try {
      const [sessionsRes, coursesRes, groupsRes, roomsRes, professorsRes, semestersRes] = await Promise.all([
        http.get(API.sessions),
        http.get(API.courses),
        http.get(API.groups),
        http.get(API.rooms),
        http.get(API.professors),
        http.get(API.semesters),
      ]);

      const semestersData = Array.isArray(semestersRes.data) ? semestersRes.data : [];

      setSessions(Array.isArray(sessionsRes.data) ? sessionsRes.data : []);
      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      setGroups(Array.isArray(groupsRes.data) ? groupsRes.data : []);
      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : []);
      setProfessors(Array.isArray(professorsRes.data) ? professorsRes.data : []);
      setSemesters(semestersData);

      if (!form.semester_id && semestersData[0]?.id) {
        setForm((current) => ({ ...current, semester_id: String(semestersData[0].id) }));
      }
    } catch (err) {
      console.error("Failed to fetch timetable data:", err);
      setError(err.response?.data?.error || "Nuk mund të ngarkohen të dhënat e orarit.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredSessions = useMemo(() => {
    const items = selectedDay === "all"
      ? sessions
      : sessions.filter((session) => Number(session.day_of_week) === Number(selectedDay));

    return [...items].sort((a, b) => {
      if (Number(a.day_of_week) !== Number(b.day_of_week)) {
        return Number(a.day_of_week) - Number(b.day_of_week);
      }
      return String(a.start_time || "").localeCompare(String(b.start_time || ""));
    });
  }, [sessions, selectedDay]);

  const scheduleStats = useMemo(() => {
    const rows = weekDays.map((day) => {
      const daySessions = sessions.filter((session) => Number(session.day_of_week) === day.id);
      return { ...day, count: daySessions.length };
    });

    const maxCount = Math.max(...rows.map((day) => day.count), 1);
    const busiestDay = rows.reduce((top, day) => (day.count > top.count ? day : top), rows[0]);
    const usedRooms = new Set(sessions.map((session) => session.room_id).filter(Boolean)).size;

    return {
      rows,
      maxCount,
      busiestDay,
      usedRooms,
      totalSessions: sessions.length,
    };
  }, [sessions]);

  const closeForm = () => {
    setForm({
      ...emptyForm,
      semester_id: semesters[0]?.id ? String(semesters[0].id) : "",
    });
    setEditingId(null);
    setIsFormOpen(false);
    setError("");
  };

  const openCreateForm = () => {
    setForm({
      ...emptyForm,
      semester_id: semesters[0]?.id ? String(semesters[0].id) : "",
    });
    setEditingId(null);
    setError("");
    setIsFormOpen(true);
  };

  const openEditForm = (session) => {
    setEditingId(session.id);
    setForm({
      course_id: String(session.course_id || ""),
      group_id: String(session.group_id || ""),
      room_id: String(session.room_id || ""),
      professor_id: String(session.professor_id || ""),
      semester_id: String(session.semester_id || ""),
      day_of_week: String(session.day_of_week || "1"),
      start_time: formatTime(session.start_time),
      end_time: formatTime(session.end_time),
      week_type: session.week_type || "all",
    });
    setError("");
    setIsFormOpen(true);
  };

  const findConflict = (payload) => {
    return sessions.find((session) => {
      if (editingId && Number(session.id) === Number(editingId)) return false;
      if (Number(session.day_of_week) !== Number(payload.day_of_week)) return false;
      if (Number(session.semester_id) !== Number(payload.semester_id)) return false;
      if (!weekTypesConflict(session.week_type || "all", payload.week_type)) return false;
      if (!timesOverlap(session.start_time, session.end_time, payload.start_time, payload.end_time)) return false;

      return (
        Number(session.room_id) === Number(payload.room_id) ||
        Number(session.professor_id) === Number(payload.professor_id) ||
        Number(session.group_id) === Number(payload.group_id)
      );
    });
  };

  const validateForm = () => {
    const requiredFields = ["course_id", "group_id", "room_id", "professor_id", "semester_id"];
    const hasMissing = requiredFields.some((field) => !form[field]);

    if (hasMissing) return "Plotësoni kursin, grupin, dhomën, profesorin dhe semestrin.";
    if (!form.start_time || !form.end_time) return "Plotësoni orën e fillimit dhe mbarimit.";
    if (form.start_time >= form.end_time) return "Ora e fillimit duhet të jetë para orës së mbarimit.";

    const conflict = findConflict(form);
    if (!conflict) return "";

    return `Konflikt me ${conflict.course_name || "një orë tjetër"} (${dayName(conflict.day_of_week)}, ${formatTime(conflict.start_time)}-${formatTime(conflict.end_time)}).`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      course_id: Number(form.course_id),
      group_id: Number(form.group_id),
      room_id: Number(form.room_id),
      professor_id: Number(form.professor_id),
      semester_id: Number(form.semester_id),
      day_of_week: Number(form.day_of_week),
      start_time: form.start_time,
      end_time: form.end_time,
      week_type: form.week_type,
    };

    setSaving(true);
    setError("");

    try {
      if (editingId) await http.put(`${API.sessions}/${editingId}`, payload);
      else await http.post(API.sessions, payload);

      await fetchAll();
      closeForm();
    } catch (err) {
      console.error("Failed to save session:", err);
      setError(err.response?.data?.error || "Ora nuk u ruajt. Kontrolloni të dhënat dhe provoni përsëri.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;

    setSaving(true);
    setError("");

    try {
      await http.delete(`${API.sessions}/${sessionToDelete.id}`);
      setSessions((items) => items.filter((item) => item.id !== sessionToDelete.id));
      if (editingId === sessionToDelete.id) closeForm();
      setSessionToDelete(null);
    } catch (err) {
      console.error("Failed to delete session:", err);
      setError(err.response?.data?.error || "Ora nuk u fshi. Provoni përsëri.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (session) => {
    setSessionToDelete(session);
  };

  const renderSelect = (name, label, items, placeholder) => (
    <div className="crud-field">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <div className="relative-field">
        <select
          id={name}
          value={form[name]}
          onChange={(e) => setForm((current) => ({ ...current, [name]: e.target.value }))}
          className="form-select"
          disabled={saving || loading}
        >
          <option value="">{placeholder}</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <FiChevronDown className="select-chevron" />
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Orari Mësimor</h1>
          <p className="page-subtitle">Krijoni, kontrolloni dhe menaxhoni orarin me të dhëna nga databaza.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={fetchAll} disabled={loading || saving}>
            <FiRefreshCw className={loading ? "icon-spin" : ""} />
            Rifresko
          </button>
          <button className="crud-add-button" onClick={openCreateForm} disabled={loading || saving}>
            <span className="crud-add-content">
              <FiPlus className="crud-add-icon" />
              Shto Orë
            </span>
          </button>
        </div>
      </div>

      {error && !isFormOpen && !sessionToDelete && (
        <div className="alert-error">
          <FiAlertCircle className="icon-alert" />
          <span>{error}</span>
        </div>
      )}

      <div className="crud-overview-card">
        <div className="crud-overview-header">
          <div>
            <h2 className="crud-overview-title">Grafiku i Ngarkesës</h2>
            <p className="crud-overview-note">Shpërndarja e seancave gjatë javës.</p>
          </div>
          <span className="badge-inline">
            <FiBarChart2 />
            {scheduleStats.totalSessions} seanca
          </span>
        </div>

        <div className="crud-overview-content">
          <div className="crud-chart">
            <div className="chart-grid">
              {scheduleStats.rows.map((day) => {
                const height = day.count > 0 ? Math.max(16, (day.count / scheduleStats.maxCount) * 100) : 7;
                return (
                  <div key={day.id} className="chart-day">
                    <div className="chart-bar-wrap">
                      <div
                        className={`chart-bar-large ${percentClass("h-pct", height)} ${
                          day.count > 0 ? "chart-bar-active" : "chart-bar-empty"
                        }`}
                      />
                      <span className="chart-count-high">
                        {loading ? "-" : day.count}
                      </span>
                    </div>
                    <span className="chart-day-label">{day.short}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="crud-summary-grid">
            <div className="crud-summary-card">
              <p className="crud-summary-label">Dita më e ngarkuar</p>
              <p className="crud-summary-value">{scheduleStats.busiestDay.label}</p>
            </div>
            <div className="crud-summary-card">
              <p className="crud-summary-label">Dhoma në përdorim</p>
              <p className="crud-summary-value">{scheduleStats.usedRooms}</p>
            </div>
            <div className="crud-summary-card">
              <p className="crud-summary-label">Totali</p>
              <p className="crud-summary-value">{scheduleStats.totalSessions}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="crud-list-card">
        <div className="crud-list-header">
          <div className="crud-list-heading">
            <div>
              <h2 className="card-title">Lista e Orarit</h2>
              <p className="section-note">Seancat e ruajtura në databazë.</p>
            </div>
            <div className="crud-filter-control">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="form-select form-select-compact"
              >
                <option value="all">Të gjitha ditët</option>
                {weekDays.map((day) => (
                  <option key={day.id} value={day.id}>{day.label}</option>
                ))}
              </select>
              <FiChevronDown className="select-chevron" />
            </div>
          </div>
        </div>

        <div className="crud-table-wrap">
          <div className="table-panel">
            <table className="table">
              <thead>
                <tr>
                  <th className="table-th">Dita</th>
                  <th className="table-th">Ora</th>
                  <th className="table-th">Kursi</th>
                  <th className="table-th">Grupi</th>
                  <th className="table-th">Dhoma</th>
                  <th className="table-th">Profesori</th>
                  <th className="table-th">Java</th>
                  <th className="table-th-right">Veprime</th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  [0, 1, 2].map((item) => (
                    <tr key={item}>
                      <td className="table-td" colSpan="8">
                        <div className="skeleton-row-lg" />
                      </td>
                    </tr>
                  ))}

                {!loading && filteredSessions.map((session) => (
                  <tr key={session.id} className="table-tr">
                    <td className="table-td text-strong">{dayName(session.day_of_week)}</td>
                    <td className="table-td">
                      <span className="badge badge-info">
                        {formatTime(session.start_time)}-{formatTime(session.end_time)}
                      </span>
                    </td>
                    <td className="table-td text-strong">{session.course_name || "-"}</td>
                    <td className="table-td">{session.group_name || "-"}</td>
                    <td className="table-td">{session.room_name || "-"}</td>
                    <td className="table-td">{session.professor_name || "-"}</td>
                    <td className="table-td">{weekTypeLabel(session.week_type)}</td>
                    <td className="table-td">
                      <div className="crud-icon-actions">
                        <button
                          type="button"
                          className="crud-icon-action crud-icon-edit"
                          onClick={() => openEditForm(session)}
                          disabled={saving}
                          title="Modifiko"
                          aria-label="Modifiko orën"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          type="button"
                          className="crud-icon-action crud-icon-delete"
                          onClick={() => openDeleteDialog(session)}
                          disabled={saving}
                          title="Fshi"
                          aria-label="Fshi orën"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && filteredSessions.length === 0 && (
                  <tr>
                    <td colSpan="8" className="empty-cell-lg">
                      Nuk ka seanca për filtrin e zgjedhur.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        open={isFormOpen}
        onClose={saving ? undefined : closeForm}
        title={editingId ? "Modifiko Orën" : "Shto Orë të Re"}
        description="Plotësoni të dhënat e orës. Sistemi kontrollon konfliktet para ruajtjes."
        size="xl"
        footer={
          <>
            <button type="button" className="crud-cancel-button" onClick={closeForm} disabled={saving}>
              Anulo
            </button>
            <button type="submit" form="timetable-form" className="crud-save-button" disabled={saving || loading}>
              <span className="crud-button-content">
                {editingId ? <FiSave /> : <FiPlus />}
                {saving ? "Duke ruajtur..." : editingId ? "Ruaj" : "Shto në Orar"}
              </span>
            </button>
          </>
        }
      >
        {error && (
          <div className="alert-error">
            <FiAlertCircle className="icon-alert" />
            <span>{error}</span>
          </div>
        )}

        <form id="timetable-form" onSubmit={handleSubmit} className="crud-form-grid">
          {renderSelect("course_id", "Kursi", courses, "Zgjidh kursin")}
          {renderSelect("group_id", "Grupi", groups, "Zgjidh grupin")}
          {renderSelect("room_id", "Dhoma", rooms, "Zgjidh dhomën")}
          {renderSelect("professor_id", "Profesori", professors, "Zgjidh profesorin")}
          {renderSelect("semester_id", "Semestri", semesters, "Zgjidh semestrin")}

          <div className="crud-field">
            <label className="form-label" htmlFor="day_of_week">
              Dita
            </label>
            <div className="relative-field">
              <select
                id="day_of_week"
                value={form.day_of_week}
                onChange={(e) => setForm((current) => ({ ...current, day_of_week: e.target.value }))}
                className="form-select"
                disabled={saving}
              >
                {weekDays.map((day) => (
                  <option key={day.id} value={day.id}>{day.label}</option>
                ))}
              </select>
              <FiChevronDown className="select-chevron" />
            </div>
          </div>

          <div className="crud-field">
            <label className="form-label" htmlFor="start_time">
              Fillimi
            </label>
            <input
              id="start_time"
              type="time"
              value={form.start_time}
              onChange={(e) => setForm((current) => ({ ...current, start_time: e.target.value }))}
              className="form-input"
              disabled={saving}
            />
          </div>

          <div className="crud-field">
            <label className="form-label" htmlFor="end_time">
              Mbarimi
            </label>
            <input
              id="end_time"
              type="time"
              value={form.end_time}
              onChange={(e) => setForm((current) => ({ ...current, end_time: e.target.value }))}
              className="form-input"
              disabled={saving}
            />
          </div>

          <div className="crud-field-wide">
            <label className="form-label" htmlFor="week_type">
              Tipi i Javës
            </label>
            <div className="relative-field">
              <select
                id="week_type"
                value={form.week_type}
                onChange={(e) => setForm((current) => ({ ...current, week_type: e.target.value }))}
                className="form-select"
                disabled={saving}
              >
                {weekTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <FiChevronDown className="select-chevron" />
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(sessionToDelete)}
        onClose={saving ? undefined : () => setSessionToDelete(null)}
        title="Konfirmo fshirjen"
        description="Ky veprim do ta largojë orën nga orari."
        size="sm"
        footer={
          <>
            <button type="button" className="crud-cancel-button" onClick={() => setSessionToDelete(null)} disabled={saving}>
              Anulo
            </button>
            <button type="button" className="crud-save-button-danger" onClick={confirmDeleteSession} disabled={saving}>
              <span className="crud-button-content">
                <FiTrash2 />
                {saving ? "Duke fshirë..." : "Fshi Orën"}
              </span>
            </button>
          </>
        }
      >
        <div className="delete-box">
          <p className="delete-text">
            Jeni i sigurt që doni të fshini{" "}
            <span className="delete-name">{sessionToDelete?.course_name || "këtë orë"}</span>?
          </p>
          {sessionToDelete && (
            <p className="delete-detail">
              {dayName(sessionToDelete.day_of_week)} · {formatTime(sessionToDelete.start_time)}-{formatTime(sessionToDelete.end_time)}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Timetable;


