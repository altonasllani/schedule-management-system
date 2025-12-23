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
  );
}

export default App;