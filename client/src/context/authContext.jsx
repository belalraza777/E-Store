// authContext.jsx - Global authentication state management
import { createContext, useContext, useState, useEffect } from "react";
import { register, login, logout, checkAuth, resetPassword } from "../api/authApi";
import { disconnectSocket } from "../socket";

// Create auth context for sharing auth state across components
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize user from localStorage; server session is validated separately via cookie
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Save user data to state and localStorage
    const saveAuthData = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        // Keep legacy token storage cleared so stale bearer auth does not override the cookie session.
        localStorage.removeItem("token");
    };

    // Clear all auth data on logout
    const clearAuthData = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        disconnectSocket();
    };

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkUser = async () => {
            const result = await checkAuth();
            if (result.success && result.authenticated) {
                saveAuthData(result.data);
            } else {
                clearAuthData();
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // Handle user login
    const handleLogin = async (credentials) => {
        const result = await login(credentials);
        if (result.success) {
            saveAuthData(result.data);
        }else {
            setError(result.message || "Login failed");
        }
        return result;
    };

    // Refresh user data from server
    const refreshUser = async () => {
        const result = await checkAuth();
        if (result.success && result.authenticated) {
            saveAuthData(result.data);
            return { success: true, data: result.data };
        } else {
            setError(result.message || "Authentication check failed");
            clearAuthData();
            return { success: false };
        }
    };

    // Handle new user registration
    const handleRegister = async (credentials) => {
        const result = await register(credentials);
        if (result.success) {
            saveAuthData(result.data);
        }else{
            setError(result.message || "Registration failed");
        }
        return result;
    };

    // Handle user logout
    const handleLogout = async () => {
        const result = await logout();
        clearAuthData();
        return result;
    };

    // Handle password reset
    const handleResetPassword = async (passwordData) => {
        const result = await resetPassword(passwordData);
        if (!result.success) {
            setError(result.message || "Password reset failed");
        }
        return result;
    };

    // Provide auth state and functions to children
    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated: !!user,
            handleLogin,
            handleRegister,
            handleLogout,
            handleResetPassword,
            refreshUser
        }}>
            {/* Only render children after loading is complete */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);