import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

interface Props {
  children: React.ReactNode;
}

export function AdminRoute({ children }: Props) {
  const { token, user } = useAuthStore();

  if (!token || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
