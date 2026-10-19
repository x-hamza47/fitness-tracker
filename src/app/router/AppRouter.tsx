import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../../pages/public/Home/Home";
import AuthPage from "../../pages/auth/AuthPage";
import Overview from "@/pages/dashboard/Overview/Overview";
import Workouts from "@/pages/dashboard/Workouts/Workouts";

function Placeholder({ title }: { title: string }) {
    return (
        <h1 className="text-3xl font-semibold tracking-tighter uppercase">
            {title}
        </h1>
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
                    { path: "nutrition", element: <Placeholder title="Nutrition" /> },
                    { path: "progress", element: <Placeholder title="Progress" /> },
                ],
            },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}