import { Navigate } from "react-router-dom";
import { useAuth, roleHome } from "../lib/auth";
import type { Role } from "../types";
import type { ReactNode } from "react";

interface Props {
  roles?: Role[];
  children: ReactNode;
}

export function ProtectedRoute({ roles, children }: Props) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={roleHome(user.role)} replace />;
  return <>{children}</>;
}
