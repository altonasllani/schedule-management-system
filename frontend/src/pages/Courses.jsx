import React, { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiBookOpen,
  FiEdit2,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import http from "../api/http";
import Modal from "../components/Modal";

const COURSE_API = "/catalog1/courses";

const emptyCourseForm = {
  name: "",
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyCourseForm);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await http.get(COURSE_API);
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError(err.response?.data?.error || "Kurset nuk mund të ngarkohen.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return courses;

    return courses.filter((course) => {
      const name = course.name?.toLowerCase() || "";
      return name.includes(term) || String(course.id).includes(term);
    });
  }, [courses, search]);

  const closeForm = () => {
    setForm(emptyCourseForm);
    setEditingId(null);
    setIsFormOpen(false);
    setError("");
  };

  const openCreateForm = () => {
    setForm(emptyCourseForm);
    setEditingId(null);
    setError("");
    setIsFormOpen(true);
  };

  const openEditForm = (course) => {
    setEditingId(course.id);
    setForm({ name: course.name || "" });
    setError("");
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();

    if (name.length < 2) {
      setError("Emri i kursit duhet të ketë të paktën 2 karaktere.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingId) {
        const res = await http.put(`${COURSE_API}/${editingId}`, { name });
        setCourses((items) => items.map((course) => (course.id === editingId ? res.data : course)));
      } else {
        const res = await http.post(COURSE_API, { name });
        setCourses((items) => [...items, res.data]);
      }

      closeForm();
    } catch (err) {
      console.error("Failed to save course:", err);
      setError(err.response?.data?.error || "Kursi nuk u ruajt. Provoni përsëri.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    setSaving(true);
    setError("");

    try {
      await http.delete(`${COURSE_API}/${courseToDelete.id}`);
      setCourses((items) => items.filter((item) => item.id !== courseToDelete.id));
      setCourseToDelete(null);
      if (editingId === courseToDelete.id) closeForm();
    } catch (err) {
      console.error("Failed to delete course:", err);
      setError(err.response?.data?.error || "Kursi nuk u fshi. Kontrolloni nëse përdoret në orar.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (course) => {
    setCourseToDelete(course);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Menaxhimi i Kurseve</h1>
          <p className="page-subtitle">Shtoni, modifikoni dhe fshini kurset nga sistemi.</p>
        </div>
        <div className="page-actions">
          <div className="status-pill">
            <FiBookOpen className="icon-emerald" />
            {courses.length} kurse
          </div>
          <button className="crud-add-button" onClick={openCreateForm} disabled={saving}>
            <span className="crud-add-content">
              <FiPlus className="crud-add-icon" />
              Shto Kurs
            </span>
          </button>
        </div>
      </div>

      {error && !isFormOpen && !courseToDelete && (
        <div className="alert-error">
          <FiAlertCircle className="icon-alert" />
          <span>{error}</span>
        </div>
      )}

      <div className="crud-overview-card">
        <div className="crud-overview-header">
          <div>
            <h2 className="crud-overview-title">Përmbledhje e Kurseve</h2>
            <p className="crud-overview-note">Pamje e shpejtë e katalogut dhe rezultateve të filtrimit.</p>
          </div>
          <span className="badge-inline">
            <FiBookOpen />
            Katalogu
          </span>
        </div>

        <div className="crud-overview-content">
          <div className="crud-summary-grid">
            <div className="crud-summary-card">
              <p className="crud-summary-label">Kurse totale</p>
              <p className="crud-summary-value">{courses.length}</p>
            </div>
            <div className="crud-summary-card">
              <p className="crud-summary-label">Rezultate</p>
              <p className="crud-summary-value">{filteredCourses.length}</p>
            </div>
            <div className="crud-summary-card">
              <p className="crud-summary-label">Statusi</p>
              <p className="crud-summary-value">Aktiv</p>
            </div>
          </div>
        </div>
      </div>

      <div className="crud-list-card">
        <div className="crud-list-header">
          <div className="crud-list-heading">
            <div>
              <h2 className="card-title">Lista e Kurseve</h2>
              <p className="section-note">
                Kërkoni dhe menaxhoni kurset ekzistuese.
              </p>
            </div>
            <button className="btn btn-secondary" onClick={fetchCourses} disabled={loading || saving}>
              <FiRefreshCw className={loading ? "icon-spin" : ""} />
              Rifresko
            </button>
          </div>

          <div className="crud-search">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Kërko sipas emrit ose ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input-search"
            />
          </div>
        </div>

        <div className="crud-table-wrap">
          <div className="table-panel">
            <table className="table">
              <thead>
                <tr>
                  <th className="table-th">ID</th>
                  <th className="table-th">Emri i Kursit</th>
                  <th className="table-th">Statusi</th>
                  <th className="table-th-right">Veprime</th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  [0, 1, 2].map((item) => (
                    <tr key={item}>
                      <td className="table-td" colSpan="4">
                        <div className="skeleton-row" />
                      </td>
                    </tr>
                  ))}

                {!loading &&
                  filteredCourses.map((course) => (
                    <tr key={course.id} className="table-tr">
                      <td className="table-td text-muted-strong">#{course.id}</td>
                      <td className="table-td text-strong">{course.name}</td>
                      <td className="table-td">
                        <span className="badge badge-success">Aktiv</span>
                      </td>
                      <td className="table-td">
                        <div className="crud-icon-actions">
                          <button
                            type="button"
                            className="crud-icon-action crud-icon-edit"
                            onClick={() => openEditForm(course)}
                            disabled={saving}
                            title="Modifiko"
                            aria-label="Modifiko kursin"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            type="button"
                            className="crud-icon-action crud-icon-delete"
                            onClick={() => openDeleteDialog(course)}
                            disabled={saving}
                            title="Fshi"
                            aria-label="Fshi kursin"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {!loading && filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan="4" className="empty-cell">
                      Nuk u gjet asnjë kurs.
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
        title={editingId ? "Modifiko Kursin" : "Shto Kurs të Ri"}
        description="Plotësoni emrin e kursit dhe ruajeni në katalog."
        size="sm"
        footer={
          <>
            <button type="button" className="crud-cancel-button" onClick={closeForm} disabled={saving}>
              Anulo
            </button>
            <button type="submit" form="course-form" className="crud-save-button" disabled={saving}>
              <span className="crud-button-content">
                {editingId ? <FiSave /> : <FiPlus />}
                {saving ? "Duke ruajtur..." : editingId ? "Ruaj" : "Shto"}
              </span>
            </button>
          </>
        }
      >
        {error && (
          <div className="alert-error-sm">
            <FiAlertCircle className="icon-alert" />
            <span>{error}</span>
          </div>
        )}

        <form id="course-form" onSubmit={handleSubmit} className="crud-form">
          <div className="crud-field">
            <label htmlFor="course-name" className="form-label">
              Emri i Kursit
            </label>
            <input
              id="course-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              placeholder="p.sh. Programim i Avancuar"
              className="form-input"
              disabled={saving}
              autoFocus
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(courseToDelete)}
        onClose={saving ? undefined : () => setCourseToDelete(null)}
        title="Konfirmo fshirjen"
        description="Ky veprim nuk mund të kthehet mbrapa."
        size="sm"
        footer={
          <>
            <button type="button" className="crud-cancel-button" onClick={() => setCourseToDelete(null)} disabled={saving}>
              Anulo
            </button>
            <button type="button" className="crud-save-button-danger" onClick={confirmDeleteCourse} disabled={saving}>
              <span className="crud-button-content">
                <FiTrash2 />
                {saving ? "Duke fshirë..." : "Fshi Kursin"}
              </span>
            </button>
          </>
        }
      >
        <div className="delete-box">
          <p className="delete-text">
            Jeni i sigurt që doni të fshini kursin <span className="delete-name">{courseToDelete?.name}</span>?
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Courses;


