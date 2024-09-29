'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ProtectPage() {
  const [role, setRole] = useState(''); // 当前用户角色
  const [permissions, setPermissions] = useState([]); // 当前用户权限
  const [rolesList, setRolesList] = useState([]); // 所有角色列表
  const [permissionsList, setPermissionsList] = useState([]); // 所有权限列表
  const [selectedRole, setSelectedRole] = useState(''); // 选择的新角色
  const [selectedPermissions, setSelectedPermissions] = useState([]); // 选择的新权限
  const [showModal, setShowModal] = useState(false); // 控制模态框显示
  const [error, setError] = useState('');
  const router = useRouter();

  // 获取用户角色和权限，以及所有角色和权限选项
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('/api/user');
        setRole(userRes.data.role);
        setPermissions(userRes.data.permissions);

        // 获取所有角色和权限
        const rolesRes = await axios.get('/api/roles');
        const permissionsRes = await axios.get('/api/permissions');
        setRolesList(rolesRes.data);
        setPermissionsList(permissionsRes.data);
      } catch (err) {
        setError('无法获取数据');
      }
    };

    fetchData();
  }, []);

  // 处理权限更新
  const handleUpdatePermissions = async () => {
    try {
      await axios.put('/api/user/permissions', {
        role: selectedRole,
        permissions: selectedPermissions,
      });
      setRole(selectedRole); // 更新用户角色显示
      setPermissions(selectedPermissions); // 更新用户权限显示
      setShowModal(false); // 关闭模态框
    } catch (err) {
      setError('更新权限失败');
    }
  };

  return (
    <div style={modernStyles.container}>
      <h1 style={modernStyles.title}>用户权限管理</h1>
      {error && <p style={modernStyles.error}>{error}</p>}
      <div style={modernStyles.info}>
        <p><strong>当前角色：</strong>{role}</p>
        <p><strong>当前权限：</strong>{permissions.join(', ')}</p>
      </div>
      <button style={modernStyles.button} onClick={() => setShowModal(true)}>更改权限</button>

      {/* 模态框 */}
      {showModal && (
        <div style={modernStyles.modal}>
          <h2 style={modernStyles.modalTitle}>设置新权限</h2>

          {/* 选择角色 */}
          <div style={modernStyles.field}>
            <label style={modernStyles.label}>选择角色：</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={modernStyles.select}
            >
              <option value="">选择角色</option>
              {rolesList.map((r) => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* 选择权限 */}
          <div style={modernStyles.field}>
            <label style={modernStyles.label}>选择权限：</label>
            <select
              multiple
              value={selectedPermissions}
              onChange={(e) => setSelectedPermissions(Array.from(e.target.selectedOptions, option => option.value))}
              style={modernStyles.select}
            >
              {permissionsList.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <button style={modernStyles.updateButton} onClick={handleUpdatePermissions}>更新</button>
          <button style={modernStyles.closeButton} onClick={() => setShowModal(false)}>取消</button>
        </div>
      )}
    </div>
  );
}

const modernStyles = {
  container: {
    padding: '40px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  info: {
    marginBottom: '20px',
    fontSize: '1.2rem',
    color: '#555',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    width: '400px',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: '1.8rem',
    marginBottom: '20px',
    color: '#333',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '1.1rem',
    marginBottom: '10px',
    color: '#555',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  updateButton: {
    padding: '12px 24px',
    fontSize: '1rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '10px',
    transition: 'background-color 0.3s ease',
  },
  updateButtonHover: {
    backgroundColor: '#218838',
  },
  closeButton: {
    padding: '12px 24px',
    fontSize: '1rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  closeButtonHover: {
    backgroundColor: '#c82333',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
  },
};
