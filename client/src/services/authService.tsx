// authService.jsx
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// アクセストークンのリフレッシュを行う関数
const refreshAccessToken = async () => {
    try {
        const response = await axios.post(`${API_URL}/refresh-token`, {}, { 
            withCredentials: true 
        });
        return response.data.access_token;
    } catch (error) {
        console.error('リフレッシュトークンの取得に失敗しました', error);
        throw error;
    }
};

// リクエストインターセプター
api.interceptors.request.use(
    (config) => {
        // HTTPOnly Cookieを使用するため、ここでは何もしない
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// レスポンスインターセプター
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await refreshAccessToken();
                return api(originalRequest);
            } catch (refreshError) {
                // リフレッシュに失敗した場合はログアウト処理を実行
                await logout();
                throw refreshError;
            }
        }
        return Promise.reject(error);
    }
);

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error) {
        console.error('ログインに失敗しました:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await api.post('/logout');
        return response.data;
    } catch (error) {
        console.error('ログアウトに失敗しました:', error);
        throw error;
    }
};

export const register = async (username: string, email: string, password: string) => {
    try {
        const response = await api.post('/register', { 
            username, 
            email, 
            password 
        });
        return response.data;
    } catch (error) {
        console.error('新規登録に失敗しました:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get('/current-user');
        return response.data;
    } catch (error) {
        console.error('ユーザー情報の取得に失敗しました:', error);
        throw error;
    }
};

export const isAuthenticated = async () => {
    try {
        const response = await api.get('/is-authenticated');
        return response.data;
    } catch (error) {
        return false;
    }
};