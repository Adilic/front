'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // 引入axios

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 防止重复提交
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true); // 禁用按钮，防止重复提交
  
    try {
      const res = await axios.post('/api/login', {
        username,
        password,
      });
  
      if (res.status === 200) {
        // 获取JWT并存储到localStorage
        localStorage.setItem('token', res.data.token);
  
        // 设置全局请求头，后续请求会自动携带JWT
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  
        // 成功登录后跳转到主界面
        router.push('/');
      }
    } catch (err) {
      // 检查返回的状态码，显示具体的错误信息
      if (err.response && err.response.status === 403) {
        setError('用户名或密码错误');
      } else {
        setError('网络错误，请稍后重试');
      }
    } finally {
      setIsSubmitting(false); // 恢复按钮状态
    }
  };

  const handleRegister = () => {
    router.push('/register'); // 跳转到注册页面
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>登录</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          disabled={isSubmitting} // 提交时禁用输入框
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          disabled={isSubmitting} // 提交时禁用输入框
        />
        <button type="submit" style={styles.button} disabled={isSubmitting}>
          {isSubmitting ? '登录中...' : '登录'}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
      <p>没有账号？<button onClick={handleRegister} style={styles.linkButton}>注册</button></p>
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
