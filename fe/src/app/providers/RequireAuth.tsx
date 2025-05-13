import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
