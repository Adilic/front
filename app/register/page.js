'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // 引入axios

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // 邮箱可为空
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 防止重复提交
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 简单的表单验证，移除了对邮箱的验证
    if (!username || !password) {
      setError('请填写用户名和密码');
      return;
    }

    setIsSubmitting(true); // 禁用提交按钮

    try {
      const res = await axios.post('/api/register', {
        username,
        password,
        email: email || undefined, // 如果邮箱为空则不传递该字段
      });

      if (res.status === 200) {
        setSuccess('注册成功！正在跳转到登录页面...');
        setTimeout(() => {
          router.push('/login'); // 注册成功后跳转到登录页面
        }, 2000); // 2秒后跳转
      } else {
        setError('注册失败，请重试');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsSubmitting(false); // 重新启用提交按钮
    }
  };

  const handleLogin = () => {
    router.push('/login'); // 返回登录页面
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>注册</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          disabled={isSubmitting} // 提交时禁用
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          disabled={isSubmitting} // 提交时禁用
        />
        <input
          type="email"
          placeholder="邮箱 (可选)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          disabled={isSubmitting} // 提交时禁用
        />
        <button type="submit" style={styles.button} disabled={isSubmitting}>
          {isSubmitting ? '提交中...' : '注册'}
        </button>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
      </form>
      <p>已有账号？<button onClick={handleLogin} style={styles.linkButton}>返回登录</button></p>
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
  success: {
    color: 'green',
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
