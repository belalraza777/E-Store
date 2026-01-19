// layouts/Layout.jsx
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import AdminLayout from "./AdminLayout";
import UserLayout from "./userLayout";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  // 1️⃣ Auth pages → NO header / footer
  if (location.pathname.startsWith("/auth") || location.pathname === "/login" || location.pathname === "/register") {
    return <>{children}</>;
  }

  // 2️⃣ Admin layout
  if (user?.role === "admin") {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // 3️⃣ User layout (default)
  return <UserLayout>{children}</UserLayout>;
};

export default Layout;
