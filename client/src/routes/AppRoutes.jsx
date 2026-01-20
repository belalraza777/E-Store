// routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import OAuthSuccess from '../pages/Auth/Oauth_success';
import ProtectedRoute from './ProtectedRoute';
import Product from '../pages/Product/Product';
import SingleProduct from '../pages/Product/SingleProduct';
import Cart from '../pages/Cart/Cart';
import AdminDashboard from '../pages/Admin/Dashboard.jsx';
import AdminProducts from '../pages/Admin/Products.jsx';
import ProductForm from '../pages/Admin/ProductForm.jsx';
import AdminOrders from '../pages/Admin/Orders.jsx';
import AdminOrderDetail from '../pages/Admin/OrderDetail.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<div><h1 style={{ textAlign: "center" }}>Home</h1></div>} />
            <Route path="/products" element={<Product />} />
            <Route path="/products/:slug" element={<SingleProduct />} />
            <Route path="/cart" element={<Cart />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/products"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminProducts />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/products/new"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ProductForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/products/:slug/edit"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ProductForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/orders"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminOrders />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/orders/:id"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminOrderDetail />
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
