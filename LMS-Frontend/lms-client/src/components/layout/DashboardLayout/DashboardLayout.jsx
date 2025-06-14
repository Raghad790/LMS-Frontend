import { NavLink, Outlet } from 'react-router-dom';
import styles from './DashboardLayout.module.css';
import {
  LayoutDashboard,
  Book,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react'; // You can use @mui/icons-material if preferred

// eslint-disable-next-line no-unused-vars
const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `${styles.navItem} ${isActive ? styles.active : ''}`
    }
  >
    <Icon size={20} />
    <span>{label}</span>
  </NavLink>
);

const DashboardLayout = () => {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Khatwa LMS</h2>
        <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <SidebarLink to="/dashboard/courses" icon={Book} label="Courses" />
        <SidebarLink to="/dashboard/assignments" icon={FileText} label="Assignments" />
        <SidebarLink to="/dashboard/settings" icon={Settings} label="Settings" />
        <SidebarLink to="/logout" icon={LogOut} label="Logout" />
      </aside>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
