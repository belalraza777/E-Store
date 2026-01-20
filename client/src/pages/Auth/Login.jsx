import { useMemo, useState } from "react";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/authContext";
// Styles loaded via main.css
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock } from "react-icons/fi";

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
            <div className="login-loading">
                <div className="loading-dot" />
                <p>Checking your session...</p>
            </div>
        );
    }

    return (
        <div className="login-wrap">
            <div className="login-card simple">
                <div className="login-header">
                    <div className="login-logo">
                        <img src="https://png.pngtree.com/element_pic/00/16/09/2057e0eecf792fb.jpg" alt="E-Store logo" className="brand-logo" />
                    </div>
                    <h2>Welcome back</h2>
                    <p className="muted">Sign in to continue</p>
                </div>

                <a href={googleAuthUrl} className="login-btn btn-google">
                    <FcGoogle size={20} />
                    Continue with Google
                </a>

                <div className="divider">or</div>

                <form onSubmit={handlePasswordSubmit} className="login-form">
                    <label className="form-group">
                        <span className="form-label">Email</span>
                        <div className="input-with-icon">
                            <FiMail className="input-icon" aria-hidden="true" />
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

                    <label className="form-group">
                        <span className="form-label">Password</span>
                        <div className="input-with-icon">
                            <FiLock className="input-icon" aria-hidden="true" />
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

                    <button type="submit" disabled={submitting} className="login-btn btn-primary">
                        {submitting ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="login-footer">
                    <span className="muted">New here?</span>
                    <Link to="/register" className="signup-link">Create account</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;