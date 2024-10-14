"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 引入 useRouter
import axios from "axios";

export default function RolesTable() {
  const [rolesWithPermissions, setRolesWithPermissions] = useState([]); // 存储角色和权限数据
  const [newRole, setNewRole] = useState(""); // 新角色名称
  const [selectedRole, setSelectedRole] = useState(""); // 选中的角色ID
  const [selectedPermissions, setSelectedPermissions] = useState([]); // 已选的权限
  const [permissionsList, setPermissionsList] = useState([]); // 所有权限的列表
  const router = useRouter();  // 使用 Next.js 的 useRouter 来定义 router
  // 组件外部的 fetchRolesAndPermissions 函数
  const fetchRolesAndPermissions = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/get_role_permissions");
      setRolesWithPermissions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert('您没有权限');
      } else {
        console.error("访问失败:", err); // 捕获其他类型的错误
      }
    }
  };

  // 组件内部的 useEffect，用于页面加载时获取角色和权限
  useEffect(() => {
    fetchRolesAndPermissions(); // 界面加载时调用
  }, []);

 // 点击 "Add Role" 按钮时跳转到 "AddRole" 页面
 const handleNavigateToAddRole = () => {
  router.push('/add_role');  // 跳转到 /add_role 页面
};

// 删除角色
const handleDeleteRole = async (roleId) => {
  try {
    await axios.delete(`http://localhost:8080/api/delete_roles/${roleId}`);
    alert('Role deleted successfully');
    fetchRolesAndPermissions();  // 删除成功后刷新角色和权限列表
  } catch (err) {
    if (err.response && err.response.status === 403) {
      alert('您没有权限');
    } else {
      console.error("删除失败:", err); // 捕获其他类型的错误
    }
  }
};

 // 进入编辑模式时，跳转到编辑界面并传递当前角色信息
 const handleEditRole = (role) => {
  const params = new URLSearchParams({
    id: role.id,  // 传递角色ID
    roleName: role.roleName,  // 传递角色名称
    permissions: JSON.stringify(role.permissions.map((perm) => perm.id))  // 传递角色已有权限
  });
  
  // 拼接 URL 并跳转
  router.push(`/edit_role?${params.toString()}`);
};



  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Roles and Permissions</h1>

      {/* 添加新角色按钮 */}
      <div style={styles.section}>
        <button onClick={handleNavigateToAddRole} style={styles.button}>
          Add Role
        </button>
      </div>

      {/* 角色和权限列表 */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Permissions</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rolesWithPermissions.map((role) => (
            <tr key={role.id}>
              <td style={styles.td}>{role.roleName}</td>
              <td style={styles.td}>
                {role.permissions.length > 0 ? (
                  role.permissions.map((perm) => (
                    <span key={perm.id} style={styles.permissionTag}>
                      {perm.permissionName}
                    </span>
                  ))
                ) : (
                  <span>No permissions</span>
                )}
              </td>
              <td style={styles.td}>
                <button
                  onClick={() => handleEditRole(role)}
                  style={styles.button}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  style={styles.buttonDelete}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 编辑角色权限 */}
      {selectedRole && (
        <div style={styles.section}>
          <h2>Edit Role Permissions</h2>
          <select
            multiple
            value={selectedPermissions}
            onChange={handlePermissionChange}
            style={styles.select}
          >
            {permissionsList.map((perm) => (
              <option key={perm.id} value={perm.id}>
                {perm.permissionName}
              </option>
            ))}
          </select>
          <button onClick={handleUpdateRolePermissions} style={styles.button}>
            Update Permissions
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
    fontWeight: "bold",
  },
  section: {
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    marginRight: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  buttonDelete: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  th: {
    borderBottom: "2px solid #ddd",
    padding: "10px",
    textAlign: "left",
    fontSize: "1.2rem",
    fontWeight: "bold",
    backgroundColor: "#007bff",
    color: "white",
  },
  td: {
    borderBottom: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
    fontSize: "1rem",
    color: "#555",
  },
  permissionTag: {
    backgroundColor: "	#7FFFAA", // 背景色
    color: "black", // 字体颜色
    borderRadius: "6px",
    padding: "5px 10px",
    marginRight: "5px",
    display: "inline-block",
    fontSize: "0.9rem",
    whiteSpace: "nowrap", // 确保文字不会折行
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
};
