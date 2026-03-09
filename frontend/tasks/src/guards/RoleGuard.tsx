import { Navigate } from "react-router-dom";

function RoleGuard({children, allowedRoles}: {children: React.ReactNode; allowedRoles: string[]}) {

    const role = localStorage.getItem("role");
    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" />;
    }


    return children;
}
export default RoleGuard;
