import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../../pages/public/Home/Home";
import AuthPage from "../../pages/auth/AuthPage";

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
                    { index: true, element: <Placeholder title="Overview" /> },
                    { path: "workouts", element: <Placeholder title="Workouts" /> },
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