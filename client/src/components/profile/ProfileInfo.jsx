

import './ProfileInfo.css';
// ProfileInfo: Displays and allows editing of user's personal information
// Props:
//   profile: user profile object (name, email, phone)

const ProfileInfo = ({ profile }) => {
  // Access updateProfile action from store
  const { updateProfile } = useProfileStore();
  // State for edit mode toggle
  const [editMode, setEditMode] = useState(false);
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  // State for error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // Form state for name, email, phone
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || ""
  });

  // Handle input changes and clear messages
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error || success) {
      setError("");
      setSuccess("");
    }
  };

  // Validate form fields before submit
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.phone && !/^\d+$/.test(formData.phone.replace(/\s/g, ''))) {
      setError("Phone number should contain only digits");
      return false;
    }
    return true;
  };

  // Handle form submit for profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error(error || "Please fix the errors above.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await updateProfile(formData);
      if (result && result.success) {
        setSuccess("Profile updated successfully!");
        toast.success("Profile updated successfully!");
        setTimeout(() => {
          setEditMode(false);
          setSuccess("");
        }, 1200);
      } else {
        setError(result?.message || "Failed to update profile");
        toast.error(result?.message || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || ""
    });
    setEditMode(false);
    setError("");
    setSuccess("");
  };

  // Helper to check if form has changed
  const isFormChanged = () => {
    return (
      formData.name !== (profile?.name || "") ||
      formData.email !== (profile?.email || "") ||
      formData.phone !== (profile?.phone || "")
    );
  };

  return (
    <div className="profile-info">
      {!editMode ? (
        // View Mode
        <div className="profile-info__view">
          <div className="profile-info__grid">
            <div className="profile-info__item">
              <div className="profile-info__label">
                <FiUser className="profile-info__icon" />
                <span>Name</span>
              </div>
              <div className="profile-info__value">{profile?.name || "Not provided"}</div>
            </div>
            
            <div className="profile-info__item">
              <div className="profile-info__label">
                <FiMail className="profile-info__icon" />
                <span>Email</span>
              </div>
              <div className="profile-info__value">{profile?.email || "Not provided"}</div>
            </div>
            
            <div className="profile-info__item">
              <div className="profile-info__label">
                <FiPhone className="profile-info__icon" />
                <span>Phone</span>
              </div>
              <div className="profile-info__value">{profile?.phone || "Not provided"}</div>
            </div>
          </div>
          
          <button 
            className="profile-info__button profile-info__button--outline"
            onClick={() => setEditMode(true)}
          >
            <FiEdit2 /> Edit Profile
          </button>
        </div>
      ) : (
        // Edit Mode
        <form className="profile-info__form" onSubmit={handleSubmit}>
          <div className="profile-info__form-grid">
            <div className="profile-info__form-group">
              <label htmlFor="name">
                <FiUser /> Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="profile-info__input"
                required
              />
            </div>
            
            <div className="profile-info__form-group">
              <label htmlFor="email">
                <FiMail /> Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="profile-info__input"
                required
              />
            </div>
            
            <div className="profile-info__form-group">
              <label htmlFor="phone">
                <FiPhone /> Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="profile-info__input"
              />
              <p className="profile-info__hint">Optional</p>
            </div>
          </div>
          
          {error && (
            <div className="profile-info__message profile-info__message--error">
              <FiX /> {error}
            </div>
          )}
          
          {success && (
            <div className="profile-info__message profile-info__message--success">
              <FiCheck /> {success}
            </div>
          )}
          
          <div className="profile-info__actions">
            <button
              type="submit"
              className="profile-info__button profile-info__button--primary"
              disabled={loading || !isFormChanged()}
            >
              {loading ? (
                <>
                  <div className="profile-info__spinner profile-info__spinner--sm"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave /> Save Changes
                </>
              )}
            </button>
            
            <button
              type="button"
              className="profile-info__button profile-info__button--secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              <FiX /> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileInfo;