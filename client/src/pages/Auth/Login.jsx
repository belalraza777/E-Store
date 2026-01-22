import { useMemo, useState } from "react";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/authContext";
import "./login.css";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock } from "react-icons/fi";
import logo from '../../assets/estorelogo.png';

const LoginPage = () => {
    // Navigation hooks
    const navigate = useNavigate();
    const location = useLocation();

    // Get auth context
    const { handleLogin, loading: authLoading, user } = useAuth();

    // Form state
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [submitting, setSubmitting] = useState(false);

    // Determine redirect path (default to home)
    const redirectPath = location.state?.from?.pathname || "/";

    // Get Google auth URL
    const googleAuthUrl = useMemo(() => {
        const base = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
        return `${base.replace(/\/$/, "")}/auth/google`;
    }, []);

    // Handle form input change
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    // Handle email/password login submission
    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        const result = await handleLogin({ email: formData.email.trim(), password: formData.password });
        setSubmitting(false);

        if (result.success) {
            if (result.data.isblocked) {
                toast.error("Your account has been blocked. Please contact support.");
                return redirect('/');
            }
            if (user && user.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
                return;
            }
            toast.success("Logged in successfully");
            navigate(redirectPath, { replace: true });
        } else {
            toast.error(result.message || "Invalid email or password");
        }
    };

    if (authLoading) {
        return (
            <div className="auth-page">
                <div className="auth-page__loading">
                    <div className="auth-page__loading-dot" />
                    <p>Checking your session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-page__card">
                <div className="auth-page__header">
                    <div className="auth-page__logo">
                        <img src={logo} alt="E-Store logo" className="auth-page__logo-img" />
                    </div>
                    <h2 className="auth-page__title">Welcome back</h2>
                    <p className="auth-page__subtitle">Sign in to continue</p>
                </div>

                <a href={googleAuthUrl} className="auth-page__btn auth-page__btn--google">
                    <FcGoogle size={20} />
                    Continue with Google
                </a>

                <div className="auth-page__divider">or</div>

                <form onSubmit={handlePasswordSubmit} className="auth-page__form">
                    <label className="auth-page__form-group">
                        <span className="auth-page__form-label">Email</span>
                        <div className="auth-page__input-wrapper">
                            <FiMail className="auth-page__input-icon" aria-hidden="true" />
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>
                    </label>

                    <label className="auth-page__form-group">
                        <span className="auth-page__form-label">Password</span>
                        <div className="auth-page__input-wrapper">
                            <FiLock className="auth-page__input-icon" aria-hidden="true" />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                        </div>
                    </label>

                    <button type="submit" disabled={submitting} className="auth-page__btn auth-page__btn--primary">
                        {submitting ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="auth-page__footer">
                    <span>New here?</span>
                    <Link to="/register" className="auth-page__link">Create account</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;