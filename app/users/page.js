'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UserRoleTable() {
  const [users, setUsers] = useState([]);  // 存储用户及其角色数据
  const [rolesList, setRolesList] = useState([]);  // 存储所有角色列表
  const router = useRouter();  // 使用 Next.js 的 useRouter 来定义 router

  // 获取所有用户及其角色
  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const fetchUsersAndRoles = async () => {
    try {
      // 获取所有用户及其角色
      const usersRes = await axios.get("http://localhost:8080/api/get_user_roles");
      setUsers(usersRes.data);

      // 获取所有角色
      const rolesRes = await axios.get("http://localhost:8080/api/get_roles");
      setRolesList(rolesRes.data);
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('您没有访问用户信息的权限');
        } else {
          console.error("请求失败:", err); // 捕获其他类型的错误
        }
      }
    };

  // 点击 "Edit" 按钮时跳转到用户角色编辑页面
  const handleEditUser = (user) => {
    const params = new URLSearchParams({
      id: user.id,  // 传递用户ID
      username: user.username,  // 传递用户名
      roles: JSON.stringify(user.roles.map((role) => role.id))  // 传递用户已有角色
    });
    // 跳转到 /edit_user_role 页面
    router.push(`/edit_user?${params.toString()}`);
  };

 const handleNavigateToAddUser = () => {
    router.push('/add_user');  
  };
  
  // 删除用户
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/delete_user/${userId}`);
      alert('User deleted successfully');
      fetchUsersAndRoles();  // 删除成功后刷新用户和角色列表
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('您没有权限');
        } else {
          console.error("删除失败:", err); // 捕获其他类型的错误
        }
      }
    };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Users and Roles</h1>
      <div style={styles.section}>
        <button onClick={handleNavigateToAddUser} style={styles.button}>
          Add User
        </button>
      </div>

      {/* 用户和角色列表 */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Roles</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={styles.td}>{user.username}</td>
              <td style={styles.td}>
                {user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <span key={role.id} style={styles.permissionTag}>
                      {role.roleName}
                    </span>
                  ))
                ) : (
                  <span>No roles assigned</span>
                )}
              </td>
              <td style={styles.td}>
                <button
                  onClick={() => handleEditUser(user)}
                  style={styles.button}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  style={styles.buttonDelete}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    backgroundColor: "#7FFFAA",  // 背景色
    color: "black",  // 字体颜色
    borderRadius: "6px",
    padding: "5px 10px",
    marginRight: "5px",
    display: "inline-block",
    fontSize: "0.9rem",
    whiteSpace: "nowrap",  // 确保文字不会折行
  },
};
