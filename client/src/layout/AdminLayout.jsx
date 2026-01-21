// AdminLayout.jsx - Layout for admin users with admin header
import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout-wrapper">
            {/* Admin navigation header */}
            <AdminHeader />
            {/* Main content area for admin pages */}
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
