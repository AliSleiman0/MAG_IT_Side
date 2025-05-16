// api.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// In-memory token storage
let authToken: string | null = null;

/**
 * Call this from your Context after login/logout to keep the axios
 * instance in sync with your in-memory token.
 */
export const setAuthToken = (token: string | null) => {
    authToken = token;
};

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        Pragma: 'no-cache',
        'Cache-control': 'no-cache',
    },
    timeout: 20000,
});

// Attach token from memory on every request
api.interceptors.request.use((config) => {
    if (authToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

// Global 401 handler
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Optionally clear our in-memory token & redirect
            authToken = null;
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default api;
