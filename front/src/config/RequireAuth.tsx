import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { RequireAuthProps } from "../types/auth";

const RequireAuth = ({ allowedRole }: RequireAuthProps) => {
    const location = useLocation();
    const authContext = useAuth();

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { auth } = authContext;

    const isAuthorized =
        allowedRole === "BASIC"
            ? auth?.userInfo?.roleName === "BASIC" || auth?.userInfo?.roleName === "ADMIN"
            : auth?.userInfo?.roleName === allowedRole;

    return isAuthorized ? (
        <Outlet />
    ) : auth?.accessToken
        ? <Navigate to="/unauthorized" state={{ from: location }} replace />
        : <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;