// UserLayout.jsx - Layout for regular users with header and footer
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const UserLayout = ({ children }) => {
  return (
    <div className="user-layout-wrapper">
      {/* Site header with navigation */}
      <Header />
      {/* Main content area */}
      <main className="user-main">
        {children}
      </main>
      {/* Site footer */}
      <Footer />
    </div>
  );
};

export default UserLayout;
