import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DefaultLayout from "@/components/layout/defaultLayout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import DeviceManagement from "@/pages/DeviceManagement";
import Groups from "@/pages/Groups";
import Profile from "@/pages/Profile";
import Spaces from "@/pages/Spaces";
import ComponentExamples from "@/pages/ComponentExamples";

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/devices', element: <DeviceManagement /> },
            { path: '/groups', element: <Groups /> },
            { path: '/spaces', element: <Spaces /> },
            { path: '/profile', element: <Profile /> },
            // { path: '/settings', element: <Settings /> },
            { path: '/components', element: <ComponentExamples /> }
        ]
    }
]);