import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import {
  Home,
  BookOpen,
  Users,
  Settings,
  FileText,
  BarChart2,
  MessageSquare,
  HelpCircle,
  LogOut,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";

const Sidebar = ({ collapsed }) => {
  const { user, logout } = useAuth();
  const isInstructor = user?.role === "instructor";

  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <Home size={20} />,
    },
    {
      path: "/dashboard/courses",
      name: "My Courses",
      icon: <BookOpen size={20} />,
    },
    ...(isInstructor
      ? [
          {
            path: "/dashboard/instructor/courses",
            name: "Teach",
            icon: <FileText size={20} />,
          },
          {
            path: "/dashboard/instructor/analytics",
            name: "Analytics",
            icon: <BarChart2 size={20} />,
          },
        ]
      : []),
    {
      path: "/dashboard/discussions",
      name: "Discussions",
      icon: <MessageSquare size={20} />,
    },
    {
      path: "/dashboard/profile",
      name: "Profile",
      icon: <Users size={20} />,
    },
    {
      path: "/dashboard/settings",
      name: "Settings",
      icon: <Settings size={20} />,
    },
    {
      path: "/dashboard/help",
      name: "Help",
      icon: <HelpCircle size={20} />,
    },
  ];

  return (
    <div className={styles.sidebarContainer}>
      <nav className={styles.sidebarMenu}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""} ${
                collapsed ? styles.collapsed : ""
              }`
            }
          >
            <span className={styles.menuIcon}>{item.icon}</span>
            {!collapsed && <span className={styles.menuText}>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <button
          onClick={logout}
          className={`${styles.logoutButton} ${
            collapsed ? styles.collapsed : ""
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
