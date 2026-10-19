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
                    { index: true, element: <Overview /> },
                    { path: "workouts", element: <Workouts /> },
                    { path: "nutrition", element: <Nutrition /> },
                    { path: "progress", element: <Progress /> },
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