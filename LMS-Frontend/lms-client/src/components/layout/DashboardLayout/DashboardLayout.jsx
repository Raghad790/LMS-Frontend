import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./DashboardLayout.module.css";
import {
  LayoutDashboard,
  Book,
  FileText,
  Settings,
  LogOut,
  Users,
  PlusSquare,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

const SidebarLink = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `${styles.navItem} ${isActive ? styles.active : ""}`
    }
    onClick={onClick}
  >
    {Icon && <Icon size={20} />} {/* Ensure Icon is used here */}
    <span>{label}</span>
  </NavLink>
);
const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileNav = () => setMobileNavOpen(!isMobileNavOpen);
  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className={styles.layout}>
      <aside
        className={`${styles.sidebar} ${isMobileNavOpen ? styles.open : ""}`}
      >
        <div className={styles.logoRow}>
          <h2 className={styles.logo}>Khatwa LMS</h2>
          <button className={styles.closeBtn} onClick={toggleMobileNav}>
            <X size={20} />
          </button>
        </div>
        <SidebarLink
          to="/dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          onClick={closeMobileNav}
        />
        <SidebarLink
          to="/dashboard/courses"
          icon={Book}
          label="Courses"
          onClick={closeMobileNav}
        />

        {user?.role === "student" && (
          <SidebarLink
            to="/dashboard/assignments"
            icon={FileText}
            label="Assignments"
            onClick={closeMobileNav}
          />
        )}

        {user?.role === "instructor" && (
          <>
            <SidebarLink
              to="/dashboard/create-course"
              icon={PlusSquare}
              label="Create Course"
              onClick={closeMobileNav}
            />
            <SidebarLink
              to="/dashboard/my-students"
              icon={Users}
              label="My Students"
              onClick={closeMobileNav}
            />
          </>
        )}

        {user?.role === "admin" && (
          <SidebarLink
            to="/dashboard/admin/users"
            icon={Users}
            label="Manage Users"
            onClick={closeMobileNav}
          />
        )}

        <SidebarLink
          to="/dashboard/settings"
          icon={Settings}
          label="Settings"
          onClick={closeMobileNav}
        />

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={20} /> <span>Logout</span>
        </button>
      </aside>

      <main className={styles.content}>
        <div className={styles.topbar}>
          <button className={styles.menuBtn} onClick={toggleMobileNav}>
            <Menu size={24} />
          </button>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.email}</span>
            {user?.avatar && (
              <img src={user.avatar} alt="avatar" className={styles.avatar} />
            )}
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
