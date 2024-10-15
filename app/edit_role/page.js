'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';  // パラメータを取得
import axiosInstance from '../lib/axiosInstance';

export default function EditRolePage() {
  const [roleName, setRoleName] = useState('');
  const [permissionsList, setPermissionsList] = useState([]); // 利用可能な権限
  const [selectedPermissions, setSelectedPermissions] = useState([]); // 選択済みの権限
  const router = useRouter();
  const searchParams = useSearchParams();  // パラメータを取得



// 役割名と選択済みの権限を初期化
useEffect(() => {
    const currentRoleName = searchParams.get('roleName');
    const currentPermissionsIds = JSON.parse(searchParams.get('permissions') || '[]'); // 取得したのは id リスト
    setRoleName(currentRoleName);
  
    fetchPermissions(currentPermissionsIds);  // すべての権限を取得し、現在選択済みの権限を照合
  }, []);
  
  const fetchPermissions = async (currentPermissionsIds) => {
    try {
      const res = await axiosInstance.get('http://localhost:8080/api/get_permissions');
      
      // 完全な選択済み権限オブジェクトを取得
      const selectedPermissions = res.data.filter(p => currentPermissionsIds.includes(p.id));
      setSelectedPermissions(selectedPermissions);  // 完全な権限オブジェクトを設定
  
      // 利用可能な権限リストを設定し、選択済みの権限を除外
      const availablePermissions = res.data.filter(p => !currentPermissionsIds.includes(p.id));
      setPermissionsList(availablePermissions);
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('権限がありません');
        } else {
          console.error("アクセスに失敗しました:", err); // 他のエラーをキャッチ
        }
      }
    };
  
  const handlePermissionChange = (permission) => {
    if (!selectedPermissions.some(p => p.id === permission.id)) {
      setSelectedPermissions([...selectedPermissions, permission]);  // 完全なオブジェクトを選択済みの権限に追加
      setPermissionsList(permissionsList.filter(p => p.id !== permission.id));  // 利用可能な権限リストから削除
    }
  };
  
  const handleDeselectPermission = (permission) => {
    setSelectedPermissions(selectedPermissions.filter(p => p.id !== permission.id));  // 選択済みの権限を削除
    setPermissionsList([...permissionsList, permission]);  // 再度利用可能な権限リストに追加
  };
  
 // 更新された役割と権限を送信
 const handleUpdateRole = async () => {
    const roleId = searchParams.get('id');  // 役割IDを取得
    const roleData = {
      roleName: roleName,
      permissionIds: selectedPermissions.map(p => p.id)
    };

    // デバッグ用の情報を表示、undefined が含まれているかどうかを確認
    console.log('Role ID:', roleId);
    console.log('Role Data:', roleData);

    try {
      await axiosInstance.put(`http://localhost:8080/api/update_roles/${roleId}`, roleData);  // 役割を更新
      alert('役割が正常に更新されました');
      router.push('/role_permissions');  // 更新成功後、役割リストに戻る
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('権限がありません');
        } else {
          console.error("アクセスに失敗しました:", err); // 他のエラーをキャッチ
        }
      }
    };

  // 役割権限画面に戻る
  const handleBackToRoles = () => {
    router.push('/role_permissions');
  };

  return (
    <div style={styles.container}>
      {/* 入力プロンプト - 現在の役割名を固定 */}
      <div style={styles.inputSection}>
        <label style={styles.label}>役割編集中:</label>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}  // 役割名を変更可能
          style={styles.input}
        />
      </div>

      {/* 権限選択部分 - 左右に配置 */}
      <div style={styles.permissionsSection}>
        {/* 左側 - 選択済みの権限 */}
        <div style={styles.middle}>
          <h3>選択済みの権限</h3>
          <div style={styles.permissionsContainer}>
            {selectedPermissions.map((permission) => (
              <div
                key={permission.id}
                style={styles.permissionBoxSelected}
                onClick={() => handleDeselectPermission(permission)}  // クリックで選択解除
              >
                {permission.permissionName}
              </div>
            ))}
          </div>
        </div>

        {/* 右側 - 利用可能な権限 */}
        <div style={styles.right}>
          <h3>利用可能な権限</h3>
          <div style={styles.permissionsContainer}>
            {permissionsList.map((perm) => (
              <div
                key={perm.id}
                style={styles.permissionBox}
                onClick={() => handlePermissionChange(perm)}  // クリックで選択
              >
                {perm.permissionName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 下部 - 送信ボタンと戻るボタン */}
      <div style={styles.bottom}>
        <button onClick={handleUpdateRole} style={styles.button}>更新</button>
        <button onClick={handleBackToRoles} style={styles.backButton}>役割リストに戻る</button>
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
      textAlign: 'left', // テキスト左寄せ
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
