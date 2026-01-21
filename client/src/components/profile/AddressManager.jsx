
// AddressManager: Displays and allows editing of user's shipping address
import './AddressManager.css';
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
        <form className="address-manager__form" onSubmit={handleSubmit}>
          <div className="address-manager__grid">
            <div className="address-manager__group">
              <label className="address-manager__label">Address</label>
              <input 
                type="text" 
                name="address" 
                value={form.address} 
                onChange={handleChange}
                placeholder="Enter your street address"
                className="address-manager__input"
                required
              />
            </div>
            <div className="address-manager__group">
              <label className="address-manager__label">City</label>
              <input 
                type="text" 
                name="city" 
                value={form.city} 
                onChange={handleChange}
                placeholder="Enter city"
                className="address-manager__input"
                required
              />
            </div>
            <div className="address-manager__group">
              <label className="address-manager__label">Postal Code</label>
              <input 
                type="text" 
                name="postalCode" 
                value={form.postalCode} 
                onChange={handleChange}
                placeholder="Enter postal code"
                className="address-manager__input"
                required
              />
            </div>
            <div className="address-manager__group">
              <label className="address-manager__label">Country</label>
              <input 
                type="text" 
                name="country" 
                value={form.country} 
                onChange={handleChange}
                placeholder="Enter country"
                className="address-manager__input"
                required
              />
            </div>
          </div>
          <div className="address-manager__actions">
            <button 
              type="submit" 
              className="address-manager__button address-manager__button--primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="address-manager__spinner" aria-hidden="true"></span>
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
              className="address-manager__button address-manager__button--secondary"
              onClick={() => setEditMode(false)}
              disabled={loading}
            >
              <FiX /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="address-manager__display">
          {address?.address ? (
            <>
              <div className="address-manager__icon" aria-hidden="true">
                <FiMapPin />
              </div>
              <div className="address-manager__details">
                <p className="address-manager__line">{address.address}</p>
                <p className="address-manager__meta">
                  {address.city}, {address.postalCode}
                </p>
                <p className="address-manager__meta">{address.country}</p>
              </div>
              <button 
                className="address-manager__button address-manager__button--outline"
                onClick={() => setEditMode(true)}
              >
                <FiEdit /> Edit
              </button>
            </>
          ) : (
            <div className="address-manager__empty">
              <FiMapPin className="address-manager__empty-icon" aria-hidden="true" />
              <p>No address saved yet</p>
              <button 
                className="address-manager__button address-manager__button--primary"
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