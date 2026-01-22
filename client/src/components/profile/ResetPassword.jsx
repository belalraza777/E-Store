import React, { useState } from 'react';
import { FiLock, FiEdit, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'sonner';
import './ResetPassword.css';
import { useAuth } from '../../context/authContext';
// ResetPassword: Allows user to change their password
// No props required; uses local state and API call

const ResetPassword = () => {
  //use context for auth
  const { handleResetPassword } = useAuth();
  // State for toggling password form visibility
  const [isOpen, setIsOpen] = useState(false);
  // Form state for old, new, and confirm password
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  // State for password visibility toggles
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit for password reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validate all fields
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      setLoading(false);
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    try {
      const res = await handleResetPassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      });
      toast.success(res.data.message || "Password updated successfully!");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password. Please try again.");
    }
    setLoading(false);
  };

  // Handle closing the password form and reset state
  const handleClose = () => {
    setIsOpen(false);
    setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  // Render password reset form and toggle
  return (
    <div className="reset-password">
      <div className="reset-password__header" onClick={() => setIsOpen(!isOpen)}>
        <FiLock className="reset-password__icon" />
        <div className="reset-password__title">
          <h4>Change Password</h4>
          <p>Update your password to keep your account secure</p>
        </div>
        <button
          type="button"
          className="reset-password__toggle"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <FiEdit />
        </button>
      </div>

      {isOpen && (
        <div className="reset-password__panel">
          <form className="reset-password__form" onSubmit={handleSubmit}>
            <div className="reset-password__group">
              <label className="reset-password__label">Current Password</label>
              <div className="reset-password__input-wrap">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={form.oldPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className="reset-password__input"
                />
                <button
                  type="button"
                  className="reset-password__reveal"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  aria-label={showOldPassword ? "Hide password" : "Show password"}
                >
                  {showOldPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="reset-password__group">
              <label className="reset-password__label">New Password</label>
              <div className="reset-password__input-wrap">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password (min. 6 characters)"
                  autoComplete="new-password"
                  className="reset-password__input"
                />
                <button
                  type="button"
                  className="reset-password__reveal"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="reset-password__group">
              <label className="reset-password__label">Confirm New Password</label>
              <div className="reset-password__input-wrap">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="reset-password__input"
                />
                <button
                  type="button"
                  className="reset-password__reveal"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* No inline error/success message, handled by toast */}

            <div className="reset-password__actions">
              <button
                type="submit"
                className="reset-password__button reset-password__button--primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="reset-password__spinner" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
              <button
                type="button"
                className="reset-password__button reset-password__button--secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;