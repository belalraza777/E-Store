// layouts/AdminLayout.jsx
import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout-wrapper">
            <AdminHeader />
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
