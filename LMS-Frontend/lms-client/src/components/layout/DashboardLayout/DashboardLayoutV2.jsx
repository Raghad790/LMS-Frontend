import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X, ChevronLeft } from "lucide-react";
import Sidebar from "../../ui/Sidebar/Sidebar";
import TopBar from "../../ui/Topbar/TopBar";
import styles from "./DashboardLayoutV2.module.css";

const DashboardLayoutV2 = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* Desktop Sidebar */}
      <div
        className={`${styles.sidebar} ${
          sidebarCollapsed ? styles.collapsed : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            {!sidebarCollapsed && (
              <span className={styles.logoText}>Khatwa</span>
            )}
          </div>
          <button
            className={styles.collapseButton}
            onClick={toggleSidebar}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <ChevronLeft
              size={18}
              className={sidebarCollapsed ? styles.rotated : ""}
            />
          </button>
        </div>

        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Mobile menu toggle */}
      <button
        className={styles.mobileMenuToggle}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={toggleMobileMenu}>
          <div
            className={styles.mobileSidebar}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.mobileLogoContainer}>
              <span className={styles.logoText}>Khatwa</span>
              <button
                onClick={toggleMobileMenu}
                className={styles.mobileCloseButton}
              >
                <X size={24} />
              </button>
            </div>
            <Sidebar collapsed={false} />
          </div>
        </div>
      )}

      <div
        className={`${styles.mainContent} ${
          sidebarCollapsed ? styles.expanded : ""
        }`}
      >
        <TopBar
          isSidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />
        <div className={styles.contentWrapper}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayoutV2;
