// routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import OAuthSuccess from '../Oauth/Oauth_success';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<div>Home</div>} />
            <Route path="/products" element={<div>Products</div>} />
            <Route path="/cart" element={<div>Cart</div>} />

            {/* Auth Routes */}
            <Route path="/login" element={<div>Login</div>} />
            <Route path="/register" element={<div>Register</div>} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />

            {/* User Routes */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute allowedRoles={["user", "admin"]}>
                        <div>Profile</div>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders"
                element={
                    <ProtectedRoute allowedRoles={["user", "admin"]}>
                        <div>My Orders</div>
                    </ProtectedRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <div>Admin Dashboard</div>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/products"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <div>Manage Products</div>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/orders"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <div>Manage Orders</div>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/reviews"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <div>Manage Reviews</div>
                    </ProtectedRoute>
                }
            />

            {/* Unauthorized Route */}
            <Route path="/unauthorized" element={<div>Unauthorized</div>} />

            {/* 404 */}
            <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
    );
};

export default AppRoutes;
