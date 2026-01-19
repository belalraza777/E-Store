// layouts/AdminLayout.jsx

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout-wrapper">
            <AdminSidebar />
            <main className="admin-main">
                <AdminHeader />
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
