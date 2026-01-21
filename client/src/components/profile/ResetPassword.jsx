
// ResetPassword: Allows user to change their password
// No props required; uses local state and API call

const ResetPassword = () => {
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
      const res = await axiosInstance.patch("/auth/reset-password", {
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
      <div className="password-header" onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        <FiLock className="password-icon" />
        <div className="password-title">
          <h4>Change Password</h4>
          <p>Update your password to keep your account secure</p>
        </div>
        <button 
          type="button"
          className="toggle-form-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <FiEdit />
        </button>
      </div>
      
      {isOpen && (
        <div className="password-form-container">
          <form className="password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showOldPassword ? "text" : "password"} 
                  name="oldPassword" 
                  value={form.oldPassword} 
                  onChange={handleChange}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
                <button 
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  name="newPassword" 
                  value={form.newPassword} 
                  onChange={handleChange}
                  placeholder="Enter new password (min. 6 characters)"
                  autoComplete="new-password"
                />
                <button 
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  value={form.confirmPassword} 
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
                <button 
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            
            {/* No inline error/success message, handled by toast */}
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
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