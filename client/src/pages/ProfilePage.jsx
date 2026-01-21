import { useEffect } from "react";
import ProfileInfo from "../components/profile/ProfileInfo.jsx";
import AddressManager from "../components/profile/AddressManager.jsx";
import ResetPassword from "../components/profile/ResetPassword.jsx";
import useProfileStore from "../store/profileStore";
import { FiUser, FiMapPin, FiLock } from "react-icons/fi";

const ProfilePage = () => {
    const { profile, fetchProfile } = useProfileStore();

    useEffect(() => {
        if (!profile) {
            fetchProfile();
        }
    }, [profile, fetchProfile]);

    if (!profile) return (
        <div className="profile-loading">
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
        </div>
    );

    return (
        <div className="profile-page-container">
            <div className="profile-header">
                <div className="avatar-circle">
                    {profile.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="profile-welcome">
                    <h2>Welcome back, {profile.name}!</h2>
                    <p className="member-since">Member since {new Date(profile.createdAt).getFullYear()}</p>
                </div>
            </div>

            <div className="profile-sections">
                <div className="section-card">
                    <div className="section-header">
                        <FiUser className="section-icon" />
                        <h3>Personal Information</h3>
                    </div>
                    <ProfileInfo profile={profile} />
                </div>

                <div className="section-card">
                    <div className="section-header">
                        <FiMapPin className="section-icon" />
                        <h3>Shipping Address</h3>
                    </div>
                    <AddressManager address={profile.address} />
                </div>

                {profile.provider === "local" && (
                    <div className="section-card">
                        <div className="section-header">
                            <FiLock className="section-icon" />
                            <h3>Security</h3>
                        </div>
                        <ResetPassword />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;