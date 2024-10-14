'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';  // 获取传递的数据
import axios from 'axios';

export default function EditUserRolePage() {
  const [username, setUsername] = useState('');  // 用户名
  const [rolesList, setRolesList] = useState([]); // 可选角色
  const [selectedRoles, setSelectedRoles] = useState([]); // 已选角色
  const router = useRouter();
  const searchParams = useSearchParams();  // 获取传递的参数

  // 初始化用户名和已选角色
  useEffect(() => {
    const currentUsername = searchParams.get('username');
    const currentRoleIds = JSON.parse(searchParams.get('roles') || '[]');  // 获取的是角色 ID 列表
    setUsername(currentUsername);
  
    fetchRoles(currentRoleIds);  // 获取所有角色并匹配当前已选角色
  }, []);

  const fetchRoles = async (currentRoleIds) => {
    try {
      const res = await axios.get('http://localhost:8080/api/get_roles');
      
      // 获取完整的已选角色对象
      const selectedRoles = res.data.filter(r => currentRoleIds.includes(r.id));
      setSelectedRoles(selectedRoles);  // 设置完整的角色对象
  
      // 设置可选角色列表，排除已选角色
      const availableRoles = res.data.filter(r => !currentRoleIds.includes(r.id));
      setRolesList(availableRoles);
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('您没有权限');
        } else {
          console.error("访问失败:", err); // 捕获其他类型的错误
        }
      }
    };

  const handleRoleChange = (role) => {
    if (!selectedRoles.some(r => r.id === role.id)) {
      setSelectedRoles([...selectedRoles, role]);  // 添加到已选角色
      setRolesList(rolesList.filter(r => r.id !== role.id));  // 从可选角色列表中移除
    }
  };

  const handleDeselectRole = (role) => {
    setSelectedRoles(selectedRoles.filter(r => r.id !== role.id));  // 移除已选角色
    setRolesList([...rolesList, role]);  // 重新添加回可选角色列表
  };

  // 提交更新的用户和角色
  const handleUpdateUserRoles = async () => {
    const userId = searchParams.get('id');  // 获取用户ID
    const userData = {
      username: username,
      roleIds: selectedRoles.map(r => r.id)
    };

    try {
      await axios.put(`http://localhost:8080/api/update_user_roles/${userId}`, userData);  // 更新用户角色
      alert('User roles updated successfully');
      router.push('/users');  // 更新成功后返回用户角色列表
    }catch (err) {
        if (err.response && err.response.status === 403) {
          alert('您没有权限');
        } else {
          console.error("访问失败:", err); // 捕获其他类型的错误
        }
      }
    };
  

  // 返回用户角色界面
  const handleBackToUsers = () => {
    router.push('/users');
  };

  return (
    <div style={styles.container}>
      {/* 提示输入框 - 固定为当前用户名 */}
      <div style={styles.inputSection}>
        <label style={styles.label}>Editing User Roles for:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}  // 可以修改用户名
          style={styles.input}
          readOnly  // 用户名不可编辑
        />
      </div>

      {/* 角色选择部分 - 左右排列 */}
      <div style={styles.permissionsSection}>
        {/* 左侧 - 已选中的角色 */}
        <div style={styles.middle}>
          <h3>Selected Roles</h3>
          <div style={styles.permissionsContainer}>
            {selectedRoles.map((role) => (
              <div
                key={role.id}
                style={styles.permissionBoxSelected}
                onClick={() => handleDeselectRole(role)}  // 点击取消选择
              >
                {role.roleName}
              </div>
            ))}
          </div>
        </div>

        {/* 右侧 - 可选的角色 */}
        <div style={styles.right}>
          <h3>Available Roles</h3>
          <div style={styles.permissionsContainer}>
            {rolesList.map((role) => (
              <div
                key={role.id}
                style={styles.permissionBox}
                onClick={() => handleRoleChange(role)}  // 点击选择
              >
                {role.roleName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部 - 提交按钮和返回按钮 */}
      <div style={styles.bottom}>
        <button onClick={handleUpdateUserRoles} style={styles.button}>Update</button>
        <button onClick={handleBackToUsers} style={styles.backButton}>Back to Users</button>
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
