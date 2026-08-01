// AppRoutes.jsx - Optimized with lazy loading
import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/authContext.jsx";
import ScrollToTop from "./ScrollToTop";
import Skeleton from "../components/ui/Skeleton/Skeleton.jsx";

// ==================== Public Pages ====================
const Home = lazy(() => import("../pages/Home/Home.jsx"));
const Product = lazy(() => import("../pages/Product/Product.jsx"));
const SingleProduct = lazy(() => import("../pages/Product/SingleProduct.jsx"));
const Cart = lazy(() => import("../pages/Cart/Cart.jsx"));
const Search = lazy(() => import("../pages/search/Search.jsx"));
const TermsPolicy = lazy(() => import("../pages/Legal/TermsPolicy.jsx"));
const Login = lazy(() => import("../pages/Auth/Login.jsx"));
const Register = lazy(() => import("../pages/Auth/Register.jsx"));
const OAuthSuccess = lazy(() => import("../pages/Auth/Oauth_success.jsx"));
const NotFound = lazy(() => import("../pages/Other/NotFound.jsx"));
const Unauthorized = lazy(() => import("../pages/Other/UnAuthorized.jsx"));

// ==================== User Pages ====================
const Checkout = lazy(() => import("../pages/Checkout/Checkout.jsx"));
const Orders = lazy(() => import("../pages/Order/Orders.jsx"));
const OrderDetail = lazy(() => import("../pages/Order/OrderDetail.jsx"));
const Wishlist = lazy(() => import("../pages/Wishlist/Wishlist.jsx"));
const Feedback = lazy(() => import("../pages/Feedback/FeedBack.jsx"));
const ProfilePage = lazy(() => import("../pages/Profile/ProfilePage.jsx"));
const Agent = lazy(() => import("../pages/Ai_Agent/Agent.jsx"));

// ==================== Admin Pages ====================
const AdminDashboard = lazy(() =>
    import("../pages/Admin/pages/Dashboard/Dashboard.jsx")
);
const AdminProducts = lazy(() =>
    import("../pages/Admin/pages/Products/ProductAdmin.jsx")
);
const ProductForm = lazy(() =>
    import("../pages/Admin/pages/Products/ProductForm.jsx")
);
const AdminOrders = lazy(() =>
    import("../pages/Admin/pages/Orders/Orders.jsx")
);
const AdminOrderDetail = lazy(() =>
    import("../pages/Admin/pages/Orders/OrderDetail.jsx")
);
const AdminUsers = lazy(() =>
    import("../pages/Admin/pages/Users/UserManagement.jsx")
);

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <>
            <ScrollToTop />

            <Suspense fallback={<Skeleton />}>
                <Routes>
                    {/* ==================== PUBLIC ROUTES ==================== */}
                    <Route
                        path="/"
                        element={
                            user?.role === "admin" ? (
                                <Navigate to="/admin/dashboard" replace />
                            ) : (
                                <Home />
                            )
                        }
                    />

                    <Route path="/products" element={<Product />} />
                    <Route path="/products/:slug" element={<SingleProduct />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/terms-and-policy" element={<TermsPolicy />} />
                    <Route
                        path="/terms"
                        element={<Navigate to="/terms-and-policy#terms" replace />}
                    />
                    <Route
                        path="/privacy"
                        element={<Navigate to="/terms-and-policy#privacy" replace />}
                    />

                    {/* ==================== AUTH ROUTES ==================== */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/oauth-success" element={<OAuthSuccess />} />

                    {/* ==================== USER ROUTES ==================== */}
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

                    <Route
                        path="/wishlist"
                        element={
                            <ProtectedRoute allowedRoles={["user"]}>
                                <Wishlist />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/feedback"
                        element={
                            <ProtectedRoute allowedRoles={["user"]}>
                                <Feedback />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/agents"
                        element={
                            <ProtectedRoute allowedRoles={["user"]}>
                                <Agent />
                            </ProtectedRoute>
                        }
                    />

                    {/* ==================== ADMIN ROUTES ==================== */}
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

                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminUsers />
                            </ProtectedRoute>
                        }
                    />

                    {/* ==================== OTHER ROUTES ==================== */}
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default AppRoutes;