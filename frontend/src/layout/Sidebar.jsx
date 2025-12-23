import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-60 bg-slate-800 text-slate-200 p-5 space-y-3">
      {[
        ["Dashboard", "/dashboard"],
        ["Courses", "/courses"],
        ["Groups", "/groups"],
        ["Professors", "/professors"],
        ["Rooms", "/rooms"],
        ["Semesters", "/semesters"],
        ["Audit Logs", "/audit-logs"],
      ].map(([label, path]) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `block px-3 py-2 rounded-md text-sm ${
              isActive
                ? "bg-slate-700 text-white"
                : "hover:bg-slate-700"
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
