import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import NotFound from "../../pages/NotFound.jsx";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // hoặc component loading khác
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <NotFound/>;
  }

  return <Outlet />;
};

export default ProtectedRoute;