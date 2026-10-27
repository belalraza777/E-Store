import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Ek time pe sirf ek refresh call chalegi, baaki requests uska wait karengi
let refreshPromise = null;

const refreshAccessToken = () => {
    if (!refreshPromise) {
        refreshPromise = axiosInstance
            .post('/auth/refresh')
            .finally(() => { refreshPromise = null; });
    }
    return refreshPromise;
};

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        // In routes pe refresh nahi karna (warna loop banega)
        const isAuthRoute = ['/auth/refresh', '/auth/login', '/auth/register']
            .some((url) => originalRequest.url?.includes(url));

        // Refresh sirf 401 pe, aur har request ke liye sirf ek baar
        if (status !== 401 || originalRequest._retry || isAuthRoute) {
            if (status === 401) localStorage.removeItem('user');
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            await refreshAccessToken();
        } catch {
            // Refresh fail: user logged out
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('auth:logout'));
            return Promise.reject(error);
        }

        // Refresh ho gaya, original request dobara bhejo
        return axiosInstance(originalRequest);
    }
);

export default axiosInstance;