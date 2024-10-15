'use client'; // この文を追加してコンポーネントをクライアントコンポーネントとしてマーク

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  

export default function HomePage() {
  const [zaikoList, setZaikoList] = useState([]); // 在庫データを保存
  const router = useRouter(); // useRouter フックを使用

  // 在庫データのシミュレーション
  useEffect(() => {
    const fetchZaiko = () => {
      // ダミーデータ
      const dummyData = [
        { id: 1, name: '商品A', quantity: 100, location: '倉庫1' },
        { id: 2, name: '商品B', quantity: 50, location: '倉庫2' },
        { id: 3, name: '商品C', quantity: 200, location: '倉庫3' }
      ];
      setZaikoList(dummyData);
    };
    fetchZaiko();
  }, []);

  // ナビゲーションの処理
  const handleNavigation = (path) => {
    router.push(path); // 別のページに移動
  };

  return (
    <div>
      {/* ナビゲーションバー */}
      <nav style={styles.navbar}>
        <div style={styles.navItem} onClick={() => handleNavigation('/')}>ホーム</div>
        <div style={styles.navItem} onClick={() => handleNavigation('/users')}>ユーザー情報</div>
        <div style={styles.navItem} onClick={() => handleNavigation('/role_permissions')}>権限編集</div>
      </nav>

      {/* メインコンテンツ - 在庫表 */}
      <div style={styles.container}>
        <h1 style={styles.title}>在庫表</h1>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>在庫ID</th>
              <th style={styles.th}>商品名</th>
              <th style={styles.th}>在庫数量</th>
              <th style={styles.th}>保管場所</th>
            </tr>
          </thead>
          <tbody>
            {zaikoList.map((zaiko) => (
              <tr key={zaiko.id}>
                <td style={styles.td}>{zaiko.id}</td>
                <td style={styles.td}>{zaiko.name}</td>
                <td style={styles.td}>{zaiko.quantity}</td>
                <td style={styles.td}>{zaiko.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    marginBottom: '20px'
  },
  navItem: {
    cursor: 'pointer',
    padding: '10px',
    fontWeight: 'bold'
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  title: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
    fontWeight: 'bold'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    borderBottom: '2px solid #ddd',
    padding: '10px',
    textAlign: 'left',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    backgroundColor: '#007bff',
    color: 'white'
  },
  td: {
    borderBottom: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    fontSize: '1rem',
    color: '#555'
  }
};
