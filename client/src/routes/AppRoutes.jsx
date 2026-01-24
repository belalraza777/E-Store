// AppRoutes.jsx - Defines all application routes and their access rules
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import OAuthSuccess from '../pages/Auth/Oauth_success';
import ProtectedRoute from './ProtectedRoute';
import Product from '../pages/Product/Product';
import SingleProduct from '../pages/Product/SingleProduct';
import Cart from '../pages/Cart/Cart';
import Checkout from '../pages/Checkout/Checkout.jsx';
import Orders from '../pages/Order/Orders.jsx';
import OrderDetail from '../pages/Order/OrderDetail.jsx';
import Home from '../pages/Home/Home.jsx';
import AdminDashboard from '../pages/Admin/Dashboard.jsx';
import AdminProducts from '../pages/Admin/Products.jsx';
import ProductForm from '../pages/Admin/ProductForm.jsx';
import AdminOrders from '../pages/Admin/Orders.jsx';
import AdminOrderDetail from '../pages/Admin/OrderDetail.jsx';
import { useAuth } from '../context/authContext.jsx';
import ScrollToTop from './ScrollToTop';
import ProfilePage from '../pages/Profile/ProfilePage.jsx';
import Search from '../pages/search/Search.jsx';
import TermsPolicy from '../pages/Legal/TermsPolicy.jsx';
import NotFound from '../pages/NotFound/NotFound.jsx';

const AppRoutes = () => {
    // Get current user to determine routing
    const { user } = useAuth();
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* ===== PUBLIC ROUTES - accessible by anyone ===== */}
                <Route
                    path="/" element={user?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Home />}
                />
                <Route path="/products" element={<Product />} />
                <Route path="/products/:slug" element={<SingleProduct />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/search" element={<Search/>} />
                <Route path="/terms-and-policy" element={<TermsPolicy />} />
                <Route path="/terms" element={<Navigate to="/terms-and-policy#terms" replace />} />
                <Route path="/privacy" element={<Navigate to="/terms-and-policy#privacy" replace />} />

                {/* ===== AUTH ROUTES - login/register pages ===== */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/oauth-success" element={<OAuthSuccess />} />

                {/* ===== USER ROUTES - requires user role ===== */}
                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute allowedRoles={["user"]}>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute allowedRoles={["user", "admin"]}>
                            <ProfilePage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute allowedRoles={["user"]}>
                            <Orders />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders/:id"
                    element={
                        <ProtectedRoute allowedRoles={["user"]}>
                            <OrderDetail />
                        </ProtectedRoute>
                    }
                />

                {/* ===== ADMIN ROUTES - requires admin role ===== */}
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
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default AppRoutes;
