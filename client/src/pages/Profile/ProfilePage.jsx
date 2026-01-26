// Profile page for user account management
import { useEffect } from "react";
import ProfileInfo from "../../components/profile/ProfileInfo.jsx";
import AddressManager from "../../components/profile/AddressManager.jsx";
import ResetPassword from "../../components/profile/ResetPassword.jsx";
import useProfileStore from "../../store/profileStore.js";
import { FiUser, FiMapPin, FiLock } from "react-icons/fi";
import Skeleton from "../../components/ui/Skeleton/Skeleton.jsx";
import Logout from "../../components/FunctionalBtn/Logout.jsx";
import "./ProfilePage.css";

// Main profile page component
const ProfilePage = () => {
    // Get profile data and fetch function from store
    const { profile, fetchProfile } = useProfileStore();

    // Fetch profile on mount if not loaded
    useEffect(() => {
        if (!profile) {
            fetchProfile();
        }
    }, [profile, fetchProfile]);

    // Show loading skeleton if profile is not loaded
    if (!profile) return (
        <div className="profile-page__loading" aria-busy="true">
            <Skeleton variant="circle" width="56px" height="56px" aria-label="Loading your profile" />
            <Skeleton variant="text" width="240px" />
            <Skeleton variant="text" width="180px" />
        </div>
    );

    // Render the profile page with user info, address, and security sections
    return (
        <div className="profile-page">
            {/* Header section with avatar, welcome, and role */}
            <div className="profile-page__header">
                <div className="profile-page__avatar">
                    {/* Show first letter of name or fallback */}
                    {profile.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h2 className="profile-page__welcome-title">Welcome back, {profile.name}!</h2>
                <p className="profile-page__member-since">Member since {new Date(profile.createdAt).getFullYear()}</p>
                <div className={`profile-page__role${profile?.role === 'user' ? ' profile-page__role__user' : ''}`}>
                    {/* Show admin role if applicable */}
                    {profile?.role === 'admin' && <h3>ADMIN</h3>}
                </div>
            </div>
            
            {/* Main sections: personal info, address, security */}
            <div className="profile-page__sections">
                {/* Personal Information Section */}
                <div className="profile-page__section">
                    <div className="profile-page__section-header">
                        <FiUser className="profile-page__section-icon" />
                        <h3 className="profile-page__section-title">Personal Information</h3>
                    </div>
                    <ProfileInfo profile={profile} />
                </div>

                {/* Shipping Address Section */}
                <div className="profile-page__section">
                    <div className="profile-page__section-header">
                        <FiMapPin className="profile-page__section-icon" />
                        <h3 className="profile-page__section-title">Shipping Address</h3>
                    </div>
                    <AddressManager address={profile.address} />
                </div>

                {/* Security Section (only for local provider) */}
                {profile.provider === "local" && (
                    <div className="profile-page__section">
                        <div className="profile-page__section-header">
                            <FiLock className="profile-page__section-icon" />
                            <h3 className="profile-page__section-title">Security</h3>
                        </div>
                        <ResetPassword />
                    </div>
                )}

            </div>
            {/* Logout button at the bottom, centered and spaced */}
            <div className="profile-page__logout-row">
                <Logout />
            </div>

        </div>
    );
};

export default ProfilePage;