'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // 引入 useRouter
import axios from 'axios';

export default function AddRolePage() {
  const [newRole, setNewRole] = useState('');
  const [permissionsList, setPermissionsList] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const router = useRouter();  // 使用 useRouter 进行页面跳转

  // 获取权限列表
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/get_permissions');
      setPermissionsList(res.data);
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('您没有权限');
        } else {
          console.error("访问失败:", err); // 捕获其他类型的错误
        }
      }
    };

  // 处理权限选择变化，添加到已选权限
  const handlePermissionChange = (permission) => {
    if (!selectedPermissions.includes(permission)) {
      setSelectedPermissions([...selectedPermissions, permission]);
      setPermissionsList(permissionsList.filter(p => p.id !== permission.id)); // 从可选中移除
    }
  };

  // 处理取消已选中的权限，移回到可选权限列表
  const handleDeselectPermission = (permission) => {
    setSelectedPermissions(selectedPermissions.filter(p => p.id !== permission.id));
    setPermissionsList([...permissionsList, permission]); // 添加回可选权限列表
  };

  // 提交新角色和权限
  const handleAddRole = async () => {
    const roleData = {
      roleName: newRole,
      permissionIds: selectedPermissions.map((perm) => perm.id),
    };

    try {
      await axios.post('http://localhost:8080/api/add_roles', roleData);
      alert('Role added successfully');
      setNewRole('');
      setSelectedPermissions([]);
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('您没有权限');
        } else {
          console.error("访问失败:", err); // 捕获其他类型的错误
        }
      }
    };

  // 返回到角色权限界面
  const handleBackToRoles = () => {
    router.push('/role_permissions');  // 跳转回 role_permissions 界面
  };

  return (
    <div style={styles.container}>
      {/* 提示输入框 */}
      <div style={styles.inputSection}>
        <label style={styles.label}>Please enter a new role name:</label>
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Enter role name"
          style={styles.input}
        />
      </div>

      {/* 权限选择部分 - 左右排列 */}
      <div style={styles.permissionsSection}>
        {/* 左侧 - 已选中的权限 */}
        <div style={styles.middle}>
          <h3>Selected Permissions</h3>
          <div style={styles.permissionsContainer}>
            {selectedPermissions.map((perm) => (
              <div
                key={perm.id}
                style={styles.permissionBoxSelected}
                onClick={() => handleDeselectPermission(perm)} // 点击取消选择
              >
                {perm.permissionName}
              </div>
            ))}
          </div>
        </div>

        {/* 右侧 - 可选的权限 */}
        <div style={styles.right}>
          <h3>Available Permissions</h3>
          <div style={styles.permissionsContainer}>
            {permissionsList.map((perm) => (
              <div
                key={perm.id}
                style={styles.permissionBox}
                onClick={() => handlePermissionChange(perm)} // 点击选择
              >
                {perm.permissionName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部 - 提交按钮和返回按钮 */}
      <div style={styles.bottom}>
        <button onClick={handleAddRole} style={styles.button}>
          Submit
        </button>
        <button onClick={handleBackToRoles} style={styles.backButton}>
          Back to Roles
        </button>
      </div>
    </div>
  );
}

const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // 添加阴影效果
      maxWidth: '1200px',
      margin: '0 auto', // 居中对齐
    },
    inputSection: {
      marginBottom: '20px',
      textAlign: 'left', // 文本左对齐
    },
    label: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px',
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '1rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // 输入框阴影
    },
    permissionsSection: {
      display: 'flex',
      justifyContent: 'space-between', // 左右排列
      gap: '20px',
    },
    middle: {
      flex: 1,
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    },
    right: {
      flex: 1,
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    },
    permissionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '300px', // 限制最大高度，添加滚动条
      overflowY: 'auto',  // 当内容过长时显示滚动条
    },
    permissionBox: {
        padding: '8px 12px',  // 调整方块大小
        margin: '5px 0',
        backgroundColor: '#007bff', // 使用单一背景色
        color: 'white',
        borderRadius: '6px',  // 较小的圆角
        cursor: 'pointer',
        textAlign: 'center',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.3s ease', // 平滑过渡效果
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // 添加轻微阴影
      },
      permissionBoxSelected: {
        padding: '8px 12px',  // 调整方块大小
        margin: '5px 0',
        backgroundColor: '#7FFFAA', // 使用单一背景色
        color: 'black',
        borderRadius: '6px',  // 较小的圆角
        cursor: 'pointer',
        textAlign: 'center',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // 添加轻微阴影
      },
    button: {
      padding: '12px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      display: 'inline-block',
      marginRight: '20px', // 调整间距
    },
    backButton: {
      padding: '12px 20px',
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      display: 'inline-block',
    },
    bottom: {
      marginTop: '20px',
      textAlign: 'center',
    },
    // 悬停效果
    permissionBoxHover: {
      transform: 'translateY(-3px)',  // 鼠标悬停时的轻微上升效果
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',  // 加强阴影
    },
  };
  
