import { createBrowserRouter, RouterProvider } from "react-router-dom"
import PublicLayout from "../../layouts/PublicLayout";
import Home from "../../pages/public/Home/Home";

const router = createBrowserRouter([
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            {
                index: true,
                element: <Home/>
            }
        ]
    }
]);

export default function AppRouter() {
    return (
    <RouterProvider router={router}/>
  )
}
