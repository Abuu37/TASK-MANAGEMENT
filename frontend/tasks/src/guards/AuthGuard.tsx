import type { ReactNode } from "react";
import { Navigate } from "react-router-dom"

interface AuthGuardProps {
  children: ReactNode;
}


function AuthGuard({ children }: AuthGuardProps) {
    const token = localStorage.getItem("accessToken");

    if(!token) {
        return <Navigate to= "/" replace />;
    }

    return children;
}
export default AuthGuard;