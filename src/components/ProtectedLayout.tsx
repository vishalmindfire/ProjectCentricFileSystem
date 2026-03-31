import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { AuthProvider } from "@contexts/AuthContext";
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export default ProtectedRoute;
