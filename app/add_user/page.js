'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../lib/axiosInstance';

export default function AddUserPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rolesList, setRolesList] = useState([]); // 選択可能な役割リスト
  const [selectedRoles, setSelectedRoles] = useState([]); // 選択済みの役割
  const router = useRouter();

  // 役割リストを取得
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get('http://localhost:8080/api/get_roles');
      setRolesList(res.data);
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('権限がありません');
        } else {
          console.error("アクセスに失敗しました:", err); // 他のエラーをキャッチ
        }
      }
    };
  
  // 役割の選択変更を処理し、選択済みに追加
  const handleRoleChange = (role) => {
    if (!selectedRoles.some(r => r.id === role.id)) {
      setSelectedRoles([...selectedRoles, role]);
      setRolesList(rolesList.filter(r => r.id !== role.id)); // 選択可能リストから削除
    }
  };

  // 選択済みの役割をキャンセル
  const handleDeselectRole = (role) => {
    setSelectedRoles(selectedRoles.filter(r => r.id !== role.id)); // 選択済みリストから削除
    setRolesList([...rolesList, role]); // 選択可能リストに再追加
  };

  // 新しいユーザーを送信
  const handleAddUser = async () => {
    const userData = {
      username: username,
      password: password,
      roleIds: selectedRoles.map(r => r.id),
    };

    try {
      await axiosInstance.post('http://localhost:8080/api/add_user', userData);
      alert('ユーザーが正常に追加されました');
      router.push('/users'); // 追加成功後にユーザーリストに戻る
    } catch (err) {
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
      {/* ユーザー名の入力 */}
      <div style={styles.inputSection}>
        <label style={styles.label}>ユーザー名:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ユーザー名を入力"
          style={styles.input}
        />
      </div>

      {/* パスワードの入力 */}
      <div style={styles.inputSection}>
        <label style={styles.label}>パスワード:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワードを入力"
          style={styles.input}
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
                onClick={() => handleDeselectRole(role)} // クリックで選択解除
              >
                {role.roleName}
              </div>
            ))}
          </div>
        </div>

        {/* 右側 - 選択可能な役割 */}
        <div style={styles.right}>
          <h3>利用可能な役割</h3>
          <div style={styles.permissionsContainer}>
            {rolesList.map((role) => (
              <div
                key={role.id}
                style={styles.permissionBox}
                onClick={() => handleRoleChange(role)} // クリックで選択
              >
                {role.roleName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 下部 - 送信ボタンと戻るボタン */}
      <div style={styles.bottom}>
        <button onClick={handleAddUser} style={styles.button}>ユーザー追加</button>
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
};
