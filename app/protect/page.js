'use client'; // 添加这个语句来将组件标记为客户端组件

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  

export default function HomePage() {
  const [zaikoList, setZaikoList] = useState([]); // 用于存储货物在库数据
  const router = useRouter(); // 使用 useRouter 钩子

  // 模拟货物在库数据
  useEffect(() => {
    const fetchZaiko = () => {
      // 模拟数据
      const dummyData = [
        { id: 1, name: '商品A', quantity: 100, location: '仓库1' },
        { id: 2, name: '商品B', quantity: 50, location: '仓库2' },
        { id: 3, name: '商品C', quantity: 200, location: '仓库3' }
      ];
      setZaikoList(dummyData);
    };
    fetchZaiko();
  }, []);

  // 导航栏处理
  const handleNavigation = (path) => {
    router.push(path); // 跳转到不同页面
  };

  return (
    <div>
      {/* 导航栏 */}
      <nav style={styles.navbar}>
        <div style={styles.navItem} onClick={() => handleNavigation('/')}>主页</div>
        <div style={styles.navItem} onClick={() => handleNavigation('/users')}>用户信息</div>
        <div style={styles.navItem} onClick={() => handleNavigation('/role_permissions')}>权限编辑</div>
      </nav>

      {/* 主内容 - 货物在库表 */}
      <div style={styles.container}>
        <h1 style={styles.title}>货物在库表</h1>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>货物ID</th>
              <th style={styles.th}>货物名称</th>
              <th style={styles.th}>库存数量</th>
              <th style={styles.th}>存放地点</th>
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
