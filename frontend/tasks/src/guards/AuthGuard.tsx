import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

function AuthGuard({ children }: AuthGuardProps) {
    const token = localStorage.getItem("accessToken");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/" replace state={{ authRequired: true, from: location.pathname }} />;
    }

    return children;
}
export default AuthGuard;
