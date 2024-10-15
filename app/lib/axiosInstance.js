import axios from 'axios';

// Axiosインスタンスを作成
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // あなたのバックエンドAPIのルートパスを設定
});

// リクエストインターセプター：各リクエストにJWTを付加
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター：401エラーを処理
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt');
      alert('セッションの有効期限が切れました。もう一度ログインしてください。');
      window.location.href = '/login'; // ログインページにリダイレクト
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
