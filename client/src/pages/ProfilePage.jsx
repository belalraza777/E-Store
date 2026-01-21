import { useEffect } from "react";
import ProfileInfo from "../components/profile/ProfileInfo.jsx";
import AddressManager from "../components/profile/AddressManager.jsx";
import ResetPassword from "../components/profile/ResetPassword.jsx";
import useProfileStore from "../store/profileStore";
import { FiUser, FiMapPin, FiLock } from "react-icons/fi";
import "./ProfilePage.css";

const ProfilePage = () => {
    const { profile, fetchProfile } = useProfileStore();

    useEffect(() => {
        if (!profile) {
            fetchProfile();
        }
    }, [profile, fetchProfile]);

    if (!profile) return (
        <div className="profile-page__loading">
            <div className="profile-page__spinner"></div>
            <p>Loading your profile...</p>
        </div>
    );

    return (
        <div className="profile-page">
            <div className="profile-page__header">
                <div className="profile-page__avatar">
                    {profile.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h2 className="profile-page__welcome-title">Welcome back, {profile.name}!</h2>
                <p className="profile-page__member-since">Member since {new Date(profile.createdAt).getFullYear()}</p>
            </div>

            <div className="profile-page__sections">
                <div className="profile-page__section">
                    <div className="profile-page__section-header">
                        <FiUser className="profile-page__section-icon" />
                        <h3 className="profile-page__section-title">Personal Information</h3>
                    </div>
                    <ProfileInfo profile={profile} />
                </div>

                <div className="profile-page__section">
                    <div className="profile-page__section-header">
                        <FiMapPin className="profile-page__section-icon" />
                        <h3 className="profile-page__section-title">Shipping Address</h3>
                    </div>
                    <AddressManager address={profile.address} />
                </div>

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
        </div>
    );
};

export default ProfilePage;