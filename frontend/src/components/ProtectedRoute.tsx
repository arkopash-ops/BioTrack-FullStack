import { Navigate } from "react-router-dom";
import type { Props } from "../types/ProtectedRoute.types";

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!token && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
