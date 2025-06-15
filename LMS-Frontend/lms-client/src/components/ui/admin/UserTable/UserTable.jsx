// src/components/ui/admin/UserTable/UserTable.jsx
import styles from './UserTable.module.css';

const UserTable = ({ users, onRoleChange }) => {
  return (
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
                onChange={(e) => onRoleChange(u.id, e.target.value)}
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
  );
};

export default UserTable;
