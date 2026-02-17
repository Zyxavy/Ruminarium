import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

/**
 * Higher-order component that protects routes requiring authentication.
 *
 * Behavior:
 * - Checks for the presence of a JWT token in localStorage
 * - If token exists -> renders the wrapped children (protected content)
 * - If no token -> redirects to /login page (using replace to avoid adding
 *   protected route to browser history)
*/
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const token = localStorage.getItem("token");

    if (!token) 
    {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
