'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 防止重复提交
  const router = useRouter();

  // 表单提交处理函数
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true); // 防止重复点击

    try {
      // 发起登录请求，确保使用正确的 API 路径
      const res = await axios.post('http://localhost:8080/api/login', {
        username,
        password,
      });

      if (res.status === 200) {
        // JWT を localStorage に保存
        const token = res.data.token;
        if (token) {
          localStorage.setItem('jwt', token); // 将 JWT 存储在 localStorage
          console.log('JWT stored:', token); // 调试信息，确认 JWT 已存储
          
          // 重定向到保护页面
          router.push('/protect');
        } else {
          setError('サーバーからのJWTが見つかりません。');
        }
      }
    } catch (err) {
      // 处理登录错误
      if (err.response && err.response.status === 403) {
        setError('ユーザー名またはパスワードが間違っています');
      } else {
        setError('ネットワークエラーです。しばらくしてから再試行してください');
      }
    } finally {
      setIsSubmitting(false); // 恢复按钮状态
    }
  };

  // 导航到注册页面
  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ログイン</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          disabled={isSubmitting} // 禁止重复提交时的输入
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          disabled={isSubmitting}
        />
        <button type="submit" style={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
      <p>アカウントがありませんか？
        <button onClick={handleRegister} style={styles.linkButton}>登録</button>
      </p>
    </div>
  );
}


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px',
    fontSize: '1rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  linkButton: {
    padding: '10px',
    fontSize: '1rem',
    backgroundColor: 'transparent',
    color: '#0070f3',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginTop: '20px',
  },
};
