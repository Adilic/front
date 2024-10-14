'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PermissionsPage() {
  const [users, setUsers] = useState([]); // 用户列表
  const [rolesList, setRolesList] = useState([]); // 全部角色
  const [permissionsList, setPermissionsList] = useState([]); // 全部权限
  const [selectedUser, setSelectedUser] = useState(null); // 选中的用户
  const [userRole, setUserRole] = useState(''); // 用户当前角色
  const [rolePermissions, setRolePermissions] = useState([]); // 当前角色的权限
  const [selectedRole, setSelectedRole] = useState(''); // 修改角色时选中的角色
  const [selectedPermissions, setSelectedPermissions] = useState([]); // 修改权限时选中的权限

  // 获取所有用户、角色和权限
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get('/api/users');
        setUsers(usersRes.data);

        const rolesRes = await axios.get('/api/roles');
        setRolesList(rolesRes.data);

        const permissionsRes = await axios.get('/api/permissions');
        setPermissionsList(permissionsRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchData();
  }, []);

  // 当选中用户时，获取用户的角色
  const handleUserSelect = async (userId) => {
    try {
      const userRes = await axios.get(`/api/user/${userId}`);
      setSelectedUser(userRes.data);
      setUserRole(userRes.data.role);
    } catch (err) {
      console.error('Failed to fetch user role', err);
    }
  };

  // 当选中角色时，获取角色的权限
  const handleRoleSelect = async (roleId) => {
    try {
      setSelectedRole(roleId);
      const roleRes = await axios.get(`/api/role/${roleId}/permissions`);
      setRolePermissions(roleRes.data);
      setSelectedPermissions(roleRes.data.map(p => p.id));
    } catch (err) {
      console.error('Failed to fetch role permissions', err);
    }
  };

  // 更新用户角色
  const updateUserRole = async () => {
    try {
      await axios.put(`/api/user/${selectedUser.id}/role`, { role: selectedRole });
      setUserRole(selectedRole);
    } catch (err) {
      console.error('Failed to update user role', err);
    }
  };

  // 更新角色权限
  const updateRolePermissions = async () => {
    try {
      await axios.put(`/api/role/${selectedRole}/permissions`, { permissions: selectedPermissions });
      setRolePermissions(selectedPermissions);
    } catch (err) {
      console.error('Failed to update role permissions', err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>User Roles & Permissions Management</h1>

      {/* 用户列表 */}
      <div style={styles.section}>
        <h2>Users</h2>
        <ul style={styles.list}>
          {users.map((user) => (
            <li
              key={user.id}
              style={selectedUser?.id === user.id ? styles.selected : styles.listItem}
              onClick={() => handleUserSelect(user.id)}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      {/* 用户的角色 */}
      {selectedUser && (
        <div style={styles.section}>
          <h2>Current Role: {userRole}</h2>
          <select value={selectedRole} onChange={(e) => handleRoleSelect(e.target.value)} style={styles.select}>
            <option value="">Select Role</option>
            {rolesList.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name}
              </option>
            ))}
          </select>
          <button style={styles.updateButton} onClick={updateUserRole}>Update Role</button>
        </div>
      )}

      {/* 角色的权限 */}
      {selectedRole && (
        <div style={styles.section}>
          <h2>Permissions for {rolesList.find(r => r.id === selectedRole)?.role_name}</h2>
          <select
            multiple
            value={selectedPermissions}
            onChange={(e) =>
              setSelectedPermissions(Array.from(e.target.selectedOptions, (option) => option.value))
            }
            style={styles.select}
          >
            {permissionsList.map((perm) => (
              <option key={perm.id} value={perm.id}>
                {perm.permission_name}
              </option>
            ))}
          </select>
          <button style={styles.updateButton} onClick={updateRolePermissions}>Update Permissions</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '30px',
  },
  section: {
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  selected: {
    padding: '10px',
    backgroundColor: '#0056b3',
    color: 'white',
    borderRadius: '4px',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  updateButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
  },
};
