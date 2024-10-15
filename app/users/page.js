'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from '../lib/axiosInstance';

export default function UserRoleTable() {
  const [users, setUsers] = useState([]);  // ユーザーとその役割データを保存
  const [rolesList, setRolesList] = useState([]);  // すべての役割リストを保存
  const router = useRouter();  // Next.js の useRouter を使用してルーターを定義

  // すべてのユーザーとその役割を取得
  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const fetchUsersAndRoles = async () => {
    try {
      // すべてのユーザーとその役割を取得
      const usersRes = await axiosInstance.get("http://localhost:8080/api/get_user_roles");
      setUsers(usersRes.data);

      // すべての役割を取得
      const rolesRes = await axiosInstance.get("http://localhost:8080/api/get_roles");
      setRolesList(rolesRes.data);
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('ユーザー情報をアクセスする権限がありません');
        } else {
          console.error("リクエストに失敗しました:", err); // 他のエラーをキャッチ
        }
      }
    };

  // "編集" ボタンをクリックした時、ユーザー役割編集ページに遷移
  const handleEditUser = (user) => {
    const params = new URLSearchParams({
      id: user.id,  // ユーザーIDを送信
      username: user.username,  // ユーザー名を送信
      roles: JSON.stringify(user.roles.map((role) => role.id))  // 既存の役割を送信
    });
    // /edit_user_role ページに遷移
    router.push(`/edit_user?${params.toString()}`);
  };

 const handleNavigateToAddUser = () => {
    router.push('/add_user');  
  };
  
  // ユーザーを削除
  const handleDeleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`http://localhost:8080/api/delete_user/${userId}`);
      alert('ユーザーが正常に削除されました');
      fetchUsersAndRoles();  // 削除成功後、ユーザーと役割リストを更新
    } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('権限がありません');
        } else {
          console.error("削除に失敗しました:", err); // 他のエラーをキャッチ
        }
      }
    };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => router.push('/protect')} style={styles.backButton}>
          戻る
        </button>
        <h1 style={styles.title}>ユーザーと役割</h1>
      </div>

      <div style={styles.section}>
        <button onClick={handleNavigateToAddUser} style={styles.button}>
          ユーザーを追加
        </button>
      </div>

      {/* ユーザーと役割リスト */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ユーザー名</th>
            <th style={styles.th}>役割</th>
            <th style={styles.th}>アクション</th>
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
                  <span>役割が割り当てられていません</span>
                )}
              </td>
              <td style={styles.td}>
                <button
                  onClick={() => handleEditUser(user)}
                  style={styles.button}
                >
                  編集
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  style={styles.buttonDelete}
                >
                  削除
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "2.5rem",
    color: "#333",
    fontWeight: "bold",
  },
  backButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
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
    color: "black",  // フォントの色
    borderRadius: "6px",
    padding: "5px 10px",
    marginRight: "5px",
    display: "inline-block",
    fontSize: "0.9rem",
    whiteSpace: "nowrap",  // テキストが折り返されないようにする
  },
};
