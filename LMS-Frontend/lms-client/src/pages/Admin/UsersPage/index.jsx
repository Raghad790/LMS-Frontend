import styles from "./UsersPage.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";

const UsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users", { withCredentials: true })
      .then((res) => setUsers(res.data.users || []))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (error) {
        console.log(error);
      alert("Error updating role");
    }
  };

  if (!user || user.role !== "admin") {
    return <div className={styles.error}>Access Denied</div>;
  }

  return (
    <div className={styles.container}>
      <h2>All Users</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) =>
                    handleRoleChange(u.id, e.target.value)
                  }
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
