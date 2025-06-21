import styles from "./UsersPage.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import  useAuth  from "../../../hooks/useAuth";
import UserTable from "../../../components/ui/admin/UserTable/UserTable";

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
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
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
      <UserTable users={users} onRoleChange={handleRoleChange} />
    </div>
  );
};

export default UsersPage;
