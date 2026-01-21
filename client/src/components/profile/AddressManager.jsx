
// AddressManager: Displays and allows editing of user's shipping address
// Props:
//   address: user address object (address, city, postalCode, country)

const AddressManager = ({ address }) => {
  // Access updateProfile action from store
  const { updateProfile } = useProfileStore();
  // State for edit mode toggle
  const [editMode, setEditMode] = useState(false);
  // Form state for address fields
  const [form, setForm] = useState({
    address: address?.address || "",
    city: address?.city || "",
    postalCode: address?.postalCode || "",
    country: address?.country || ""
  });
  // State for loading indicator
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit for address update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validate all fields
    if (!form.address.trim() || !form.city.trim() || !form.postalCode.trim() || !form.country.trim()) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }
    const result = await updateProfile({ address: form });
    if (!result.success) {
      toast.error(result.message || "Failed to update address");
    } else {
      toast.success("Address updated successfully!");
      setEditMode(false);
    }
    setLoading(false);
  };

  // Render address form or display based on edit mode
  return (
    <div className="address-manager">
      {editMode ? (
        <form className="address-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Address</label>
              <input 
                type="text" 
                name="address" 
                value={form.address} 
                onChange={handleChange}
                placeholder="Enter your street address"
                required
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input 
                type="text" 
                name="city" 
                value={form.city} 
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input 
                type="text" 
                name="postalCode" 
                value={form.postalCode} 
                onChange={handleChange}
                placeholder="Enter postal code"
                required
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input 
                type="text" 
                name="country" 
                value={form.country} 
                onChange={handleChange}
                placeholder="Enter country"
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FiCheck /> Save Address
                </>
              )}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setEditMode(false)}
              disabled={loading}
            >
              <FiX /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="address-display">
          {address?.address ? (
            <>
              <div className="address-icon">
                <FiMapPin />
              </div>
              <div className="address-details">
                <p className="address-line">{address.address}</p>
                <p className="address-city">
                  {address.city}, {address.postalCode}
                </p>
                <p className="address-country">{address.country}</p>
              </div>
              <button 
                className="btn btn-outline edit-btn"
                onClick={() => setEditMode(true)}
              >
                <FiEdit /> Edit
              </button>
            </>
          ) : (
            <div className="no-address">
              <FiMapPin className="empty-icon" />
              <p>No address saved yet</p>
              <button 
                className="btn btn-primary"
                onClick={() => setEditMode(true)}
              >
                <FiEdit /> Add Address
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Export the AddressManager component as default
export default AddressManager;