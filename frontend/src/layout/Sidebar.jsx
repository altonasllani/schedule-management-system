import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="legacy-sidebar">
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
            `legacy-sidebar-link ${isActive ? "legacy-sidebar-link-active" : "legacy-sidebar-link-default"}`
          }
        >
          {label}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
