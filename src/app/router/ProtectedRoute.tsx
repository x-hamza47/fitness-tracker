import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function ProtectedRoute() {
    const token = useAuthStore((s) => s.token);
    const user = useAuthStore((s) => s.user);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/auth" replace state={{ from: location }} />;
    }

    const isAdmin = user?.role === "admin";
    const path = location.pathname;

    // Normal users navigating to admin routes -> redirect to /dashboard
    if (!isAdmin && path.startsWith("/admin")) {
        return <Navigate to="/dashboard" replace />;
    }

    // Admins navigating to user-only dashboard pages -> redirect to /admin
    const isUserOnlyPage =
        path === "/dashboard" ||
        path.startsWith("/dashboard/workouts") ||
        path.startsWith("/dashboard/nutrition") ||
        path.startsWith("/dashboard/progress") ||
        path.startsWith("/dashboard/followers") ||
        path.startsWith("/dashboard/reports") ||
        path.startsWith("/dashboard/support");

    if (isAdmin && isUserOnlyPage) {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
}