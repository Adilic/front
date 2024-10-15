'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // useRouter をインポート
import axiosInstance from '../lib/axiosInstance';

export default function AddRolePage() {
  const [newRole, setNewRole] = useState('');
  const [permissionsList, setPermissionsList] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const router = useRouter();  // useRouter を使用してページ遷移を行う

  // 権限リストを取得
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await axiosInstance.get('http://localhost:8080/api/get_permissions');
      setPermissionsList(res.data);
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('権限がありません');
        } else {
          console.error("アクセス失敗:", err); // 他のエラーをキャッチ
        }
      }
    };

  // 権限の選択変更を処理し、選択済みの権限に追加
  const handlePermissionChange = (permission) => {
    if (!selectedPermissions.includes(permission)) {
      setSelectedPermissions([...selectedPermissions, permission]);
      setPermissionsList(permissionsList.filter(p => p.id !== permission.id)); // 選択肢から削除
    }
  };

  // 選択済みの権限をキャンセルし、再び選択肢に戻す
  const handleDeselectPermission = (permission) => {
    setSelectedPermissions(selectedPermissions.filter(p => p.id !== permission.id));
    setPermissionsList([...permissionsList, permission]); // 選択肢に追加
  };

  // 新しい役割と権限を送信
  const handleAddRole = async () => {
    const roleData = {
      roleName: newRole,
      permissionIds: selectedPermissions.map((perm) => perm.id),
    };

    try {
      await axiosInstance.post('http://localhost:8080/api/add_roles', roleData);
      alert('役割が正常に追加されました');
      setNewRole('');
      setSelectedPermissions([]);
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('権限がありません');
        } else {
          console.error("アクセス失敗:", err); // 他のエラーをキャッチ
        }
      }
    };

  // 役割権限ページに戻る
  const handleBackToRoles = () => {
    router.push('/role_permissions');  // role_permissions ページに戻る
  };

  return (
    <div style={styles.container}>
      {/* 入力プロンプト */}
      <div style={styles.inputSection}>
        <label style={styles.label}>新しい役割名を入力してください:</label>
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="役割名を入力"
          style={styles.input}
        />
      </div>

      {/* 権限選択部分 - 左右に配置 */}
      <div style={styles.permissionsSection}>
        {/* 左側 - 選択済みの権限 */}
        <div style={styles.middle}>
          <h3>選択済みの権限</h3>
          <div style={styles.permissionsContainer}>
            {selectedPermissions.map((perm) => (
              <div
                key={perm.id}
                style={styles.permissionBoxSelected}
                onClick={() => handleDeselectPermission(perm)} // クリックして選択解除
              >
                {perm.permissionName}
              </div>
            ))}
          </div>
        </div>

        {/* 右側 - 選択可能な権限 */}
        <div style={styles.right}>
          <h3>利用可能な権限</h3>
          <div style={styles.permissionsContainer}>
            {permissionsList.map((perm) => (
              <div
                key={perm.id}
                style={styles.permissionBox}
                onClick={() => handlePermissionChange(perm)} // クリックして選択
              >
                {perm.permissionName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 下部 - 送信ボタンと戻るボタン */}
      <div style={styles.bottom}>
        <button onClick={handleAddRole} style={styles.button}>
          送信
        </button>
        <button onClick={handleBackToRoles} style={styles.backButton}>
          役割ページに戻る
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
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // シャドウ効果を追加
      maxWidth: '1200px',
      margin: '0 auto', // 中央に配置
    },
    inputSection: {
      marginBottom: '20px',
      textAlign: 'left', // テキストを左寄せ
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
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // 入力フィールドのシャドウ
    },
    permissionsSection: {
      display: 'flex',
      justifyContent: 'space-between', // 左右に配置
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
      maxHeight: '300px', // 最大高さを制限してスクロールバーを追加
      overflowY: 'auto',  // 内容が長すぎる場合にスクロールバーを表示
    },
    permissionBox: {
        padding: '8px 12px',  // ボックスサイズを調整
        margin: '5px 0',
        backgroundColor: '#007bff', // 単一の背景色
        color: 'white',
        borderRadius: '6px',  // 小さめの角丸
        cursor: 'pointer',
        textAlign: 'center',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.3s ease', // スムーズなトランジション効果
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // 軽いシャドウを追加
      },
      permissionBoxSelected: {
        padding: '8px 12px',  // ボックスサイズを調整
        margin: '5px 0',
        backgroundColor: '#7FFFAA', // 単一の背景色
        color: 'black',
        borderRadius: '6px',  // 小さめの角丸
        cursor: 'pointer',
        textAlign: 'center',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // 軽いシャドウを追加
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
      marginRight: '20px', // スペースを調整
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
    // ホバー効果
    permissionBoxHover: {
      transform: 'translateY(-3px)',  // ホバー時の軽い上昇効果
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',  // シャドウを強化
    },
  };
