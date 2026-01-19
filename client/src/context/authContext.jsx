import { createContext, useContext, useState, useEffect } from "react";
import { register, login, logout, checkAuth, resetPassword } from "../api/authApi";
import { connectSocket, disconnectSocket } from "../socket";

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Load user and token from localStorage if available
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    // Function to save user data (token is handled by httpOnly cookie)
    const saveAuthData = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        // Token is stored in httpOnly cookie by backend
        // Also store token in localStorage for axios interceptor
        const tokenFromStorage = localStorage.getItem("token");
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
        }
    };

    // Function to clear user and token
    const clearAuthData = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        disconnectSocket();
    };

    // Check if user is authenticated on first load
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const result = await checkAuth();
                if (result.success && result.authenticated) {
                    saveAuthData(result.data);
                } else {
                    clearAuthData();
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // Effect to manage socket connection based on token
    useEffect(() => {
        if (token) {
            connectSocket(token);
        }
        return () => {
            if (!token) {
                disconnectSocket();
            }
        };
    }, [token]);

    // Handle login with email/password
    const handleLogin = async (credentials) => {
        const result = await login(credentials);
        if (result.success) {
            // Backend sets httpOnly cookie, we just save user data
            // For Bearer token support, we need to extract token from cookie or use a different approach
            // Since backend uses httpOnly cookie, we'll store a placeholder for axios interceptor
            localStorage.setItem("token", "cookie-auth");
            setToken("cookie-auth");
            saveAuthData(result.data);
        }
        return result;
    };

    // Refresh current authenticated user from server
    const refreshUser = async () => {
        const result = await checkAuth();
        if (result.success && result.authenticated) {
            saveAuthData(result.data);
            return { success: true, data: result.data };
        } else {
            clearAuthData();
            return { success: false };
        }
    };

    // Handle register new user
    const handleRegister = async (credentials) => {
        const result = await register(credentials);
        if (result.success) {
            // Backend sets httpOnly cookie
            localStorage.setItem("token", "cookie-auth");
            setToken("cookie-auth");
            saveAuthData(result.data);
        }
        return result;
    };

    // Handle logout
    const handleLogout = async () => {
        const result = await logout();
        clearAuthData();
        return result;
    };

    // Reset password
    const handleResetPassword = async (passwordData) => {
        return await resetPassword(passwordData);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            isAuthenticated: !!user,
            handleLogin,
            handleRegister,
            handleLogout,
            handleResetPassword,
            refreshUser
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Hook for consuming auth context
export const useAuth = () => useContext(AuthContext);