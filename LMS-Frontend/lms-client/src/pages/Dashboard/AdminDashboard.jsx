import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin. You can manage users below:</p>

      <Link to="/dashboard/admin/users">
        👉 Go to User Management Panel
      </Link>
    </div>
  );
};

export default AdminDashboard;
