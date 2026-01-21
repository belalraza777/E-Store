// ProtectedRoute.jsx - Guards routes based on authentication and user roles
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  // Get auth state from context
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading while checking auth status
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  // Not logged in - redirect to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but role not allowed - redirect to unauthorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.error(`Access Denied: user role "${user.role}" not in allowed roles ${JSON.stringify(allowedRoles)}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // All checks passed - render protected content
  return children;
}
