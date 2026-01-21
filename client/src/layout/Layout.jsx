// Layout.jsx - Main layout wrapper that chooses layout based on user role
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import AdminLayout from "./AdminLayout";
import UserLayout from "./userLayout";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Auth pages (login/register) - no header/footer
  if (location.pathname.startsWith("/auth") || location.pathname === "/login" || location.pathname === "/register") {
    return <>{children}</>;
  }

  // Admin users get admin layout
  if (user?.role === "admin") {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // Default - user layout with header and footer
  return <UserLayout>{children}</UserLayout>;
};

export default Layout;
