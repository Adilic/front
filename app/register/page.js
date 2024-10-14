'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // axiosの導入

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // メールは任意
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 重複送信防止
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 簡単なフォームバリデーション、メールのバリデーションは削除
    if (!username || !password) {
      setError('ユーザー名とパスワードを入力してください');
      return;
    }

    setIsSubmitting(true); // 送信ボタンを無効化

    try {
      const res = await axios.post('/api/register', {
        username,
        password,
        email: email || undefined, // メールが空の場合、フィールドを送信しない
      });

      if (res.status === 200) {
        setSuccess('登録成功！ログインページにリダイレクトします...');
        setTimeout(() => {
          router.push('/login'); // 登録成功後、ログインページにリダイレクト
        }, 2000); // 2秒後にリダイレクト
      } else {
        setError('登録に失敗しました。再試行してください');
      }
    } catch (err) {
      setError('ネットワークエラーです。しばらくしてから再試行してください');
    } finally {
      setIsSubmitting(false); // 送信ボタンを再度有効化
    }
  };

  const handleLogin = () => {
    router.push('/login'); // ログインページに戻る
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>登録</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          disabled={isSubmitting} // 送信中は無効化
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          disabled={isSubmitting} // 送信中は無効化
        />
        <input
          type="email"
          placeholder="メールアドレス (任意)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          disabled={isSubmitting} // 送信中は無効化
        />
        <button type="submit" style={styles.button} disabled={isSubmitting}>
          {isSubmitting ? '送信中...' : '登録'}
        </button>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
      </form>
      <p>すでにアカウントをお持ちですか？<button onClick={handleLogin} style={styles.linkButton}>ログインに戻る</button></p>
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
