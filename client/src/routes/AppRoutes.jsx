// AppRoutes.jsx - Defines all application routes and their access rules
import { Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import OAuthSuccess from '../pages/Auth/Oauth_success';
import ProtectedRoute from './ProtectedRoute';
import Product from '../pages/Product/Product.jsx';
import SingleProduct from '../pages/Product/SingleProduct';
import Cart from '../pages/Cart/Cart';
import Home from '../pages/Home/Home';
const Checkout = lazy(() => import('../pages/Checkout/Checkout.jsx'));
const Orders = lazy(() => import('../pages/Order/Orders.jsx'));
const OrderDetail = lazy(() => import('../pages/Order/OrderDetail.jsx'));
const AdminDashboard = lazy(() => import('../pages/Admin/pages/Dashboard/Dashboard.jsx'));
const AdminProducts = lazy(() => import('../pages/Admin/pages/Products/ProductAdmin.jsx'));
const ProductForm = lazy(() => import('../pages/Admin/pages/Products/ProductForm.jsx'));
const AdminOrders = lazy(() => import('../pages/Admin/pages/Orders/Orders.jsx'));
const AdminOrderDetail = lazy(() => import('../pages/Admin/pages/Orders/OrderDetail.jsx'));
const AdminUsers = lazy(() => import('../pages/Admin/pages/Users/UserManagement.jsx'));
const Feedback = lazy(() => import('../pages/Feedback/FeedBack.jsx'));
import { useAuth } from '../context/authContext.jsx';
import ScrollToTop from './ScrollToTop';
import ProfilePage from '../pages/Profile/ProfilePage.jsx';
import Search from '../pages/search/Search.jsx';
import TermsPolicy from '../pages/Legal/TermsPolicy.jsx';
import NotFound from '../pages/NotFound/NotFound.jsx';
import Unauthorized from '../pages/Other/UnAuthorized.jsx';
import Skeleton from '../components/ui/Skeleton/Skeleton.jsx';

const AppRoutes = () => {
    // Get current user to determine routing
    const { user } = useAuth();
    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<Skeleton />}>
                <Routes>
                    {/* ===== PUBLIC ROUTES - accessible by anyone ===== */}
                    <Route
                        path="/" element={user?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Home />}
                    />
                    <Route path="/products" element={<Product />} />
                    <Route path="/products/:slug" element={<SingleProduct />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/search" element={<Search />} />
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
                                <ProfilePage />
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
                    <Route path="/feedback" element={
                        <ProtectedRoute allowedRoles={["user"]}>
                            <Feedback />
                        </ProtectedRoute>
                    } />


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
                        path="/admin/users"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminUsers />
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
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default AppRoutes;
