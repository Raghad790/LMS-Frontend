import { useNavigate } from "react-router-dom";
import { Bell, MessageSquare, Search, Menu, User } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import styles from "./TopBar.module.css";

const TopBar = ({ isSidebarCollapsed, onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToProfile = () => {
    navigate("/dashboard/profile");
  };

  // Format the current date - June 19, 2025
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`${styles.topBar} ${
        isSidebarCollapsed ? styles.expanded : ""
      }`}
    >
      <div className={styles.leftSection}>
        {/* Sidebar toggle button - only shown on desktop when sidebar is collapsed */}
        {isSidebarCollapsed && (
          <button
            className={styles.sidebarToggle}
            onClick={onToggleSidebar}
            aria-label="Expand sidebar"
          >
            <Menu size={20} />
          </button>
        )}

        <div className={styles.searchBar}>
          <Search size={16} className={styles.searchIcon} />
          <input type="text" placeholder="Search..." />
        </div>

        <div className={styles.currentDate}>{currentDate}</div>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.iconButton}>
          <Bell size={20} />
          <span className={styles.notificationBadge}>3</span>
        </button>

        <button className={styles.iconButton}>
          <MessageSquare size={20} />
          <span className={styles.notificationBadge}>5</span>
        </button>

        <div className={styles.userProfile} onClick={goToProfile}>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user?.name || "User"}</span>
            <span className={styles.userRole}>{user?.role || "Student"}</span>
          </div>

          <div className={styles.userAvatar}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <User size={16} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
