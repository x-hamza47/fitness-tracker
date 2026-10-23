import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../../pages/public/Home/Home";
import AuthPage from "../../pages/auth/AuthPage";
import Overview from "@/pages/dashboard/Overview/Overview";
import Workouts from "@/pages/dashboard/Workouts/Workouts";
import Nutrition from "@/pages/dashboard/Nutrition/Nutrition";
import Progress from "@/pages/dashboard/Progress/Progress";
import { Link } from "react-router-dom";
import Profile from "@/pages/dashboard/Profile/Profile";
import Settings from "@/pages/dashboard/Settings/Settings";
import Followers from "@/pages/dashboard/Followers/Followers";
import Reports from "@/pages/dashboard/Reports/Reports";
import Support from "@/pages/dashboard/Support/Support";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminTickets from "@/pages/admin/AdminTickets";

// function Placeholder({ title }: { title: string }) {
//     return (
//         <h1 className="text-3xl font-semibold tracking-tighter uppercase">
//             {title}
//         </h1>
//     );
// }

function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-6xl font-semibold tracking-tighter">404</h1>
            <p className="text-muted-foreground">
                This page doesn't exist or has been moved.
            </p>
            <Link to="/" className="underline underline-offset-4">
                Back to home
            </Link>
        </div>
    );
}
import ProfileGate from "./ProfileGate";

const router = createBrowserRouter([
    {
        path: "/",
        element: <PublicLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "auth", element: <AuthPage /> },
        ],
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    {
                        element: <ProfileGate />,
                        children: [
                            { index: true, element: <Overview /> },
                            { path: "nutrition", element: <Nutrition /> },
                        ],
                    },
                    { path: "workouts", element: <Workouts /> },
                    { path: "progress", element: <Progress /> },
                    { path: "profile", element: <Profile /> },
                    { path: "settings", element: <Settings /> },
                    { path: "followers", element: <Followers /> },
                    { path: "reports", element: <Reports /> },
                    { path: "support", element: <Support /> },
                    { path: "*", element: <NotFound /> },
                ],
            },
        ],
    },
    {
        path: "/admin",
        element: <ProtectedRoute />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <AdminDashboard /> },
                    { path: "users", element: <AdminUsers /> },
                    { path: "tickets", element: <AdminTickets /> },
                    { path: "profile", element: <Profile /> },
                    { path: "settings", element: <Settings /> },
                    { path: "*", element: <NotFound /> },
                ],
            },
        ],
    },
    { path: "*", element: <NotFound /> },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}