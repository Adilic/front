'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';  // パラメータを取得
import axiosInstance from '../lib/axiosInstance';

export default function EditUserRolePage() {
  const [username, setUsername] = useState('');  // ユーザー名
  const [rolesList, setRolesList] = useState([]); // 利用可能な役割
  const [selectedRoles, setSelectedRoles] = useState([]); // 選択済みの役割
  const router = useRouter();
  const searchParams = useSearchParams();  // パラメータを取得

  // ユーザー名と選択済みの役割を初期化
  useEffect(() => {
    const currentUsername = searchParams.get('username');
    const currentRoleIds = JSON.parse(searchParams.get('roles') || '[]');  // 取得したのは役割IDリスト
    setUsername(currentUsername);
  
    fetchRoles(currentRoleIds);  // すべての役割を取得し、現在の選択済み役割を照合
  }, []);

  const fetchRoles = async (currentRoleIds) => {
    try {
      const res = await axiosInstance.get('http://localhost:8080/api/get_roles');
      
      // 完全な選択済み役割オブジェクトを取得
      const selectedRoles = res.data.filter(r => currentRoleIds.includes(r.id));
      setSelectedRoles(selectedRoles);  // 完全な役割オブジェクトを設定
  
      // 利用可能な役割リストを設定し、選択済みの役割を除外
      const availableRoles = res.data.filter(r => !currentRoleIds.includes(r.id));
      setRolesList(availableRoles);
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('権限がありません');
        } else {
          console.error("アクセスに失敗しました:", err); // 他のエラーをキャッチ
        }
      }
    };

  const handleRoleChange = (role) => {
    if (!selectedRoles.some(r => r.id === role.id)) {
      setSelectedRoles([...selectedRoles, role]);  // 選択済みの役割に追加
      setRolesList(rolesList.filter(r => r.id !== role.id));  // 利用可能な役割リストから削除
    }
  };

  const handleDeselectRole = (role) => {
    setSelectedRoles(selectedRoles.filter(r => r.id !== role.id));  // 選択済みの役割を削除
    setRolesList([...rolesList, role]);  // 再度利用可能な役割リストに追加
  };

  // 更新されたユーザーと役割を送信
  const handleUpdateUserRoles = async () => {
    const userId = searchParams.get('id');  // ユーザーIDを取得
    const userData = {
      username: username,
      roleIds: selectedRoles.map(r => r.id)
    };

    try {
      await axiosInstance.put(`http://localhost:8080/api/update_user_roles/${userId}`, userData);  // ユーザーの役割を更新
      alert('ユーザーの役割が正常に更新されました');
      router.push('/users');  // 更新成功後、ユーザーリストに戻る
    }catch (err) {
        if (err.response && err.response.status === 403) {
          alert('権限がありません');
        } else {
          console.error("アクセスに失敗しました:", err); // 他のエラーをキャッチ
        }
      }
    };
  

  // ユーザーリスト画面に戻る
  const handleBackToUsers = () => {
    router.push('/users');
  };

  return (
    <div style={styles.container}>
      {/* 入力プロンプト - 現在のユーザー名を固定 */}
      <div style={styles.inputSection}>
        <label style={styles.label}>ユーザーの役割編集中:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}  // ユーザー名を変更可能
          style={styles.input}
          readOnly  // ユーザー名は編集不可
        />
      </div>

      {/* 役割選択部分 - 左右に配置 */}
      <div style={styles.permissionsSection}>
        {/* 左側 - 選択済みの役割 */}
        <div style={styles.middle}>
          <h3>選択済みの役割</h3>
          <div style={styles.permissionsContainer}>
            {selectedRoles.map((role) => (
              <div
                key={role.id}
                style={styles.permissionBoxSelected}
                onClick={() => handleDeselectRole(role)}  // クリックで選択解除
              >
                {role.roleName}
              </div>
            ))}
          </div>
        </div>

        {/* 右側 - 利用可能な役割 */}
        <div style={styles.right}>
          <h3>利用可能な役割</h3>
          <div style={styles.permissionsContainer}>
            {rolesList.map((role) => (
              <div
                key={role.id}
                style={styles.permissionBox}
                onClick={() => handleRoleChange(role)}  // クリックで選択
              >
                {role.roleName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 下部 - 送信ボタンと戻るボタン */}
      <div style={styles.bottom}>
        <button onClick={handleUpdateUserRoles} style={styles.button}>更新</button>
        <button onClick={handleBackToUsers} style={styles.backButton}>ユーザーリストに戻る</button>
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
