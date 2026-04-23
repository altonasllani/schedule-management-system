import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiUsers,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiLogOut,
  FiMenu,
  FiX,
  FiMonitor,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";

const MainLayout = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const themeMenuRef = useRef(null);

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { name: "Kurset", icon: <FiBook />, path: "/courses" },
    { name: "Grupet", icon: <FiUsers />, path: "/groups" },
    { name: "Profesorët", icon: <FiUser />, path: "/professors" },
    { name: "Dhomat", icon: <FiMapPin />, path: "/rooms" },
    { name: "Orari", icon: <FiCalendar />, path: "/timetable" },
  ];

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ThemeIcon = theme === 'light' ? FiSun : theme === 'dark' ? FiMoon : FiMonitor;

  return (
    <div className="layoutContainer">
      <div className="mobileHeader">
        <div className="mobileLogo">
          <FiMonitor className="mobileLogoIcon" />
          Schedule System
        </div>
        <div className="mobileHeaderActions">
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="themeBtn"
            aria-label="Toggle theme menu"
          >
            <ThemeIcon className="icon-lg" />
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mobileMenuBtn"
            aria-label="Toggle navigation"
          >
            {isSidebarOpen ? <FiX className="icon-xl" /> : <FiMenu className="icon-xl" />}
          </button>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="sidebarOverlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`${"sidebar"} ${
          isSidebarOpen ? "sidebarOpen" : "sidebarClosed"
        }`}
      >
        <div className="desktopLogo">
          <div className="logoIcon">
            <FiMonitor className="icon-sm" />
          </div>
          <span>Schedule System</span>
        </div>

        <div className="navLinks">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`${"navItem"} ${
                  isActive ? "navItemActive" : "navItemDefault"
                }`}
              >
                <span className={isActive ? "navIconActive" : "navIconDefault"}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="sidebarFooter">
          <div className="userProfile">
            <div className="userAvatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="userInfo">
              <p className="userName">{user?.name || "Përdorues"}</p>
              <p className="userEmail">{user?.email || "user@domain.com"}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="logoutBtn"
          >
            <FiLogOut className="icon-lg" />
            Kthehu te Login
          </button>
        </div>
      </aside>

      <main className="mainContent">
        <div className="desktopHeader">
          <div className="desktopHeaderInner">
            <div className="headerDate">
              {new Date().toLocaleDateString("sq-AL", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="themeMenuRoot" ref={themeMenuRef}>
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="themeBtn"
                aria-label="Theme settings"
              >
                <ThemeIcon className="icon-lg" />
              </button>
              
              {isThemeMenuOpen && (
                <div className="themeDropdown">
                  <button
                    onClick={() => { setTheme('light'); setIsThemeMenuOpen(false); }}
                    className={`${"themeOption"} ${theme === 'light' ? "themeOptionActive" : "themeOptionDefault"}`}
                  >
                    <FiSun /> Light
                  </button>
                  <button
                    onClick={() => { setTheme('dark'); setIsThemeMenuOpen(false); }}
                    className={`${"themeOption"} ${theme === 'dark' ? "themeOptionActive" : "themeOptionDefault"}`}
                  >
                    <FiMoon /> Dark
                  </button>
                  <button
                    onClick={() => { setTheme('system'); setIsThemeMenuOpen(false); }}
                    className={`${"themeOption"} ${theme === 'system' ? "themeOptionActive" : "themeOptionDefault"}`}
                  >
                    <FiMonitor /> System
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="contentWrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
