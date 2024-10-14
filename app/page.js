'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>システムへようこそ</h1>
      </header>
      <main style={styles.main}>
        <p>システム機能を利用するには、まずログインまたは登録してください。</p>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={goToLogin}>ログイン</button>
          <button style={styles.button} onClick={goToRegister}>登録</button>
        </div>
      </main>
      <footer style={styles.footer}>
        <p>&copy; 2024 Adilic ZHOU. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    textAlign: 'center'
  },
  header: {
    marginBottom: '20px'
  },
  main: {
    flex: 1
  },
  buttonContainer: {
    marginTop: '20px'
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#0070f3',
    color: '#fff',
    borderRadius: '5px'
  },
  footer: {
    marginTop: '20px'
  }
};
