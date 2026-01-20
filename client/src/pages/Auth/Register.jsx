import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/authContext";
// Styles loaded via main.css
import { FiMail, FiLock, FiPhone, FiUser } from "react-icons/fi";


const RegisterPage = () => {
  // Navigation and auth context
  const navigate = useNavigate();
  const { handleRegister, loading: authLoading } = useAuth();

  // Form state and validation
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input change and clear errors
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Name must be at most 50 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please provide a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please provide a valid phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (formData.password.length > 100) {
      newErrors.password = "Password must be at most 100 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setSubmitting(true);
    const result = await handleRegister({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
    });
    setSubmitting(false);

    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/", { replace: true });
    } else {
      toast.error(result.message || "Registration failed");
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
          <h2>Create your account</h2>
          <p className="muted">Join E-Store to start shopping.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="form-group">
            <span className="form-label">Full Name</span>
            <div className="input-with-icon">
              <FiUser className="input-icon" aria-hidden="true" />
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

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
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label className="form-group">
            <span className="form-label">Phone Number</span>
            <div className="input-with-icon">
              <FiPhone className="input-icon" aria-hidden="true" />
              <input
                type="tel"
                name="phone"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>
            {errors.phone && <span className="field-error">{errors.phone}</span>}
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
                autoComplete="new-password"
              />
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>

          <button type="submit" disabled={submitting} className="login-btn btn-primary">
            {submitting ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="login-footer">
          <span className="muted">Already have an account?</span>
          <Link to="/login" className="signup-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
