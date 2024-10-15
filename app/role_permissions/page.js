'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // useRouter をインポート
import axiosInstance from '../lib/axiosInstance';

export default function RolesTable() {
  const [rolesWithPermissions, setRolesWithPermissions] = useState([]); // 役割と権限データを保存
  const [newRole, setNewRole] = useState(""); // 新しい役割名
  const [selectedRole, setSelectedRole] = useState(""); // 選択された役割ID
  const [selectedPermissions, setSelectedPermissions] = useState([]); // 選択された権限
  const [permissionsList, setPermissionsList] = useState([]); // すべての権限のリスト
  const router = useRouter();  // Next.js の useRouter を使用してルーターを定義

  // コンポーネント外の fetchRolesAndPermissions 関数
  const fetchRolesAndPermissions = async () => {
    try {
      const res = await axiosInstance.get("http://localhost:8080/api/get_role_permissions");
      setRolesWithPermissions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert('権限がありません');
      } else {
        console.error("アクセスに失敗しました:", err); // 他のエラーをキャッチ
      }
    }
  };

  // コンポーネント内の useEffect、ページ読み込み時に役割と権限を取得
  useEffect(() => {
    fetchRolesAndPermissions(); // ページロード時に呼び出す
  }, []);

  // "Add Role" ボタンをクリックした時に "AddRole" ページに遷移
  const handleNavigateToAddRole = () => {
    router.push('/add_role');  // /add_role ページに遷移
  };

  // 役割を削除
  const handleDeleteRole = async (roleId) => {
    try {
      await axiosInstance.delete(`http://localhost:8080/api/delete_roles/${roleId}`);
      alert('役割が正常に削除されました');
      fetchRolesAndPermissions();  // 削除成功後、役割と権限リストを更新
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert('権限がありません');
      } else {
        console.error("削除に失敗しました:", err); // 他のエラーをキャッチ
      }
    }
  };

  // 編集モードに入る際、編集画面に遷移し現在の役割情報を送信
  const handleEditRole = (role) => {
    const params = new URLSearchParams({
      id: role.id,  // 役割IDを送信
      roleName: role.roleName,  // 役割名を送信
      permissions: JSON.stringify(role.permissions.map((perm) => perm.id))  // 既存の権限を送信
    });
  
    // URLを組み合わせて遷移
    router.push(`/edit_role?${params.toString()}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => router.push('/protect')} style={styles.backButton}>
          戻る
        </button>
        <h1 style={styles.title}>役割と権限</h1>
      </div>

      {/* 新しい役割を追加ボタン */}
      <div style={styles.section}>
        <button onClick={handleNavigateToAddRole} style={styles.button}>
          役割を追加
        </button>
      </div>

      {/* 役割と権限リスト */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>役割</th>
            <th style={styles.th}>権限</th>
            <th style={styles.th}>アクション</th>
          </tr>
        </thead>
        <tbody>
          {rolesWithPermissions.map((role) => (
            <tr key={role.id}>
              <td style={styles.td}>{role.roleName}</td>
              <td style={styles.td}>
                {role.permissions.length > 0 ? (
                  role.permissions.map((perm) => (
                    <span key={perm.id} style={styles.permissionTag}>
                      {perm.permissionName}
                    </span>
                  ))
                ) : (
                  <span>権限がありません</span>
                )}
              </td>
              <td style={styles.td}>
                <button
                  onClick={() => handleEditRole(role)}
                  style={styles.button}
                >
                  編集
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  style={styles.buttonDelete}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 役割の権限を編集 */}
      {selectedRole && (
        <div style={styles.section}>
          <h2>役割の権限を編集</h2>
          <select
            multiple
            value={selectedPermissions}
            onChange={handlePermissionChange}
            style={styles.select}
          >
            {permissionsList.map((perm) => (
              <option key={perm.id} value={perm.id}>
                {perm.permissionName}
              </option>
            ))}
          </select>
          <button onClick={handleUpdateRolePermissions} style={styles.button}>
            権限を更新
          </button>
        </div>
      )}
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
  input: {
    padding: "10px",
    fontSize: "1rem",
    marginRight: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
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
    backgroundColor: "	#7FFFAA", // 背景色
    color: "black", // フォントの色
    borderRadius: "6px",
    padding: "5px 10px",
    marginRight: "5px",
    display: "inline-block",
    fontSize: "0.9rem",
    whiteSpace: "nowrap", // テキストが折り返されないようにする
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
};
