import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";

const Courses = () => {
  // Dummy state for the model
  const [courses, setCourses] = useState([
    { id: 1, code: "CS101", name: "Hyrje në Programim", credits: 6, department: "Shkenca Kompjuterike", status: "Aktiv" },
    { id: 2, code: "MAT201", name: "Analizë Matematike II", credits: 5, department: "Matematikë", status: "Aktiv" },
  ]);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Menaxhimi i Kurseve</h1>
          <p className="page-subtitle">Shtoni, modifikoni dhe fshini kurset nga sistemi.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Kërko kurs..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none w-64"
            />
          </div>
          <button className="btn btn-primary">
            <FiPlus /> Shto Kurs
          </button>
        </div>
      </div>

      {/* Content Card containing the Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="table-container border-none">
          <table className="table">
            <thead>
              <tr>
                <th className="table-th">Kodi</th>
                <th className="table-th">Emri i Kursit</th>
                <th className="table-th">Kredite</th>
                <th className="table-th">Departamenti</th>
                <th className="table-th">Statusi</th>
                <th className="table-th text-right">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="table-tr">
                  <td className="table-td font-medium text-slate-900">{course.code}</td>
                  <td className="table-td">{course.name}</td>
                  <td className="table-td">{course.credits}</td>
                  <td className="table-td">{course.department}</td>
                  <td className="table-td">
                    <span className={`badge ${course.status === 'Aktiv' ? 'badge-success' : 'badge-warning'}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="table-td text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Modifiko">
                        <FiEdit2 />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Fshi">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan="6" className="table-td text-center py-8 text-slate-500">
                    Nuk ka të dhëna. Klikoni "Shto Kurs" për të filluar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Courses;
