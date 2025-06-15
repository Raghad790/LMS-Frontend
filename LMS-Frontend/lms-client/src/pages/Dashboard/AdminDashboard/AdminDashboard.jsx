import { Link } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Dashboard</h1>
      <p className={styles.subtext}>Welcome, Admin. You can manage users below:</p>
      <Link to="/dashboard/admin/users" className={styles.link}>
        👉 Go to User Management Panel
      </Link>
    </div>
  );
};

export default AdminDashboard;
