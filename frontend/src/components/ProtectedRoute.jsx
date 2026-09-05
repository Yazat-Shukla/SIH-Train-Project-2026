import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const adminSession =
    localStorage.getItem("blackfire_admin");

  if (!adminSession) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;