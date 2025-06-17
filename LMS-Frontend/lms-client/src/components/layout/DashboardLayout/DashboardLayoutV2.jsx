import { useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import styles from "./DashboardLayoutV2.module.css";
import {
  LayoutDashboard,
  Book,
  FileText,
  Settings,
  LogOut,
  Users,
  PlusSquare,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

const DashboardLayoutV2 = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  // eslint-disable-next-line no-unused-vars
  const SidebarLink = ({ to, icon: SidebarIcon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.navItem} ${isActive ? styles.active : ""}`
      }
    >
      <SidebarIcon size={20} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.open : styles.closed
        }`}
      >
        <div className={styles.logo}>
          <span className={styles.logoText}>Khatwa LMS</span>
          <button onClick={toggleSidebar} className={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <SidebarLink to="/dashboard/courses" icon={Book} label="Courses" />

        {user?.role === "student" && (
          <SidebarLink
            to="/dashboard/assignments"
            icon={FileText}
            label="Assignments"
          />
        )}

        {user?.role === "instructor" && (
          <>
            <SidebarLink
              to="/dashboard/create-course"
              icon={PlusSquare}
              label="Create Course"
            />
            <SidebarLink
              to="/dashboard/my-students"
              icon={Users}
              label="My Students"
            />
          </>
        )}

        {user?.role === "admin" && (
          <SidebarLink
            to="/dashboard/admin/users"
            icon={Users}
            label="Manage Users"
          />
        )}

        <SidebarLink
          to="/dashboard/settings"
          icon={Settings}
          label="Settings"
        />

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.topbar}>
          <button onClick={toggleSidebar} className={styles.menuBtn}>
            <Menu size={22} />
          </button>
          <div className={styles.searchBar}>
            <Search size={16} />
            <input type="text" placeholder="Search..." />
          </div>
          <div className={styles.profile}>
            <Bell size={20} className={styles.notification} />
            <span className={styles.userInfoText}>
              {user?.name || user?.fullName || user?.email?.split("@")[0]}
              <br />
              <small style={{ fontSize: "0.75rem", color: "#aaa" }}>
                {user?.email}
              </small>
            </span>

            {user?.avatar && (
              <img src={user.avatar} alt="avatar" className={styles.avatar} />
            )}
          </div>
        </div>

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayoutV2;
