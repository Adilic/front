'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';  // 获取传递的数据
import axios from 'axios';

export default function EditRolePage() {
  const [roleName, setRoleName] = useState('');
  const [permissionsList, setPermissionsList] = useState([]); // 可选权限
  const [selectedPermissions, setSelectedPermissions] = useState([]); // 已选权限
  const router = useRouter();
  const searchParams = useSearchParams();  // 获取传递的参数



// 初始化角色名称和已选权限
useEffect(() => {
    const currentRoleName = searchParams.get('roleName');
    const currentPermissionsIds = JSON.parse(searchParams.get('permissions') || '[]'); // 获取的是 id 列表
    setRoleName(currentRoleName);
  
    fetchPermissions(currentPermissionsIds);  // 获取所有权限并匹配当前已选权限
  }, []);
  
  const fetchPermissions = async (currentPermissionsIds) => {
    try {
      const res = await axios.get('http://localhost:8080/api/get_permissions');
      
      // 获取完整的已选权限对象
      const selectedPermissions = res.data.filter(p => currentPermissionsIds.includes(p.id));
      setSelectedPermissions(selectedPermissions);  // 设置完整的权限对象
  
      // 设置可选权限列表，排除已选权限
      const availablePermissions = res.data.filter(p => !currentPermissionsIds.includes(p.id));
      setPermissionsList(availablePermissions);
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('您没有权限');
        } else {
          console.error("访问失败:", err); // 捕获其他类型的错误
        }
      }
    };
  
  const handlePermissionChange = (permission) => {
    if (!selectedPermissions.some(p => p.id === permission.id)) {
      setSelectedPermissions([...selectedPermissions, permission]);  // 添加完整对象到已选权限
      setPermissionsList(permissionsList.filter(p => p.id !== permission.id));  // 从可选权限列表中移除
    }
  };
  
  const handleDeselectPermission = (permission) => {
    setSelectedPermissions(selectedPermissions.filter(p => p.id !== permission.id));  // 移除已选权限
    setPermissionsList([...permissionsList, permission]);  // 重新添加回可选权限列表
  };
  
 // 提交更新的角色和权限
 const handleUpdateRole = async () => {
    const roleId = searchParams.get('id');  // 获取角色ID
    const roleData = {
      roleName: roleName,
      permissionIds: selectedPermissions.map(p => p.id)
    };

    // 打印调试信息，检查是否有 undefined
    console.log('Role ID:', roleId);
    console.log('Role Data:', roleData);

    try {
      await axios.put(`http://localhost:8080/api/update_roles/${roleId}`, roleData);  // 更新角色
      alert('Role updated successfully');
      router.push('/role_permissions');  // 更新成功后返回角色列表
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('您没有权限');
        } else {
          console.error("访问失败:", err); // 捕获其他类型的错误
        }
      }
    };

  // 返回角色权限界面
  const handleBackToRoles = () => {
    router.push('/role_permissions');
  };

  return (
    <div style={styles.container}>
      {/* 提示输入框 - 固定为当前角色名称 */}
      <div style={styles.inputSection}>
        <label style={styles.label}>Editing Role:</label>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}  // 可以修改角色名称
          style={styles.input}
        />
      </div>

      {/* 权限选择部分 - 左右排列 */}
      <div style={styles.permissionsSection}>
        {/* 左侧 - 已选中的权限 */}
        <div style={styles.middle}>
          <h3>Selected Permissions</h3>
          <div style={styles.permissionsContainer}>
            {selectedPermissions.map((permission) => (
              <div
                key={permission.id}
                style={styles.permissionBoxSelected}
                onClick={() => handleDeselectPermission(permission)}  // 点击取消选择
              >
                {permission.permissionName}
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
                onClick={() => handlePermissionChange(perm)}  // 点击选择
              >
                {perm.permissionName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部 - 提交按钮和返回按钮 */}
      <div style={styles.bottom}>
        <button onClick={handleUpdateRole} style={styles.button}>Update</button>
        <button onClick={handleBackToRoles} style={styles.backButton}>Back to Roles</button>
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

