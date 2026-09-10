// UserLayout.jsx - Layout for regular users with header and footer
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { useLocation } from "react-router-dom";

const UserLayout = ({ children }) => {
  const location = useLocation();
  const isAgentPage = location.pathname === "/agents";

  return (
    <div className={`user-layout-wrapper${isAgentPage ? " user-layout-wrapper--agent" : ""}`}>
      {/* Site header with navigation */}
      <Header />
      {/* Main content area */}
      <main className="user-main">
        {children}
      </main>
      {!isAgentPage && <Footer />}
    </div>
  );
};

export default UserLayout;
