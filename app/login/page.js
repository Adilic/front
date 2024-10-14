'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // axiosの導入

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 重複送信防止
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true); // ボタンを無効化して重複送信を防止
  
    try {
      const res = await axios.post('/api/login', {
        username,
        password,
      });
  
      if (res.status === 200) {
        // JWTを取得してlocalStorageに保存
        localStorage.setItem('token', res.data.token);
  
        // グローバルリクエストヘッダーを設定、以降のリクエストはJWTを自動的に送信
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  
        // ログイン成功後にメイン画面にリダイレクト
        router.push('/protect');
      }
    } catch (err) {
      // ステータスコードを確認し、具体的なエラーメッセージを表示
      if (err.response && err.response.status === 403) {
        setError('ユーザー名またはパスワードが間違っています');
      } else {
        setError('ネットワークエラーです。しばらくしてから再試行してください');
      }
    } finally {
      setIsSubmitting(false); // ボタンの状態を復元
    }
  };

  const handleRegister = () => {
    router.push('/register'); // 登録画面にリダイレクト
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
          disabled={isSubmitting} // 送信中は入力を無効化
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          disabled={isSubmitting} // 送信中は入力を無効化
        />
        <button type="submit" style={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
      <p>アカウントがありませんか？<button onClick={handleRegister} style={styles.linkButton}>登録</button></p>
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
