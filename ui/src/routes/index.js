import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import DefaultLayout from "@/components/layout/defaultLayout";
import Groups from "@/pages/groups/groupsList";
import Profile from "@/pages/Profile";
import ComponentExamples from "@/pages/ComponentExamples";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import EditGroups from "@/pages/groups/groupsEdit";
import SpaceList from "@/pages/groups/house/space/spaceList";
import IoTDashboard from "@/pages/home/Home";
import ChangePassword from "@/pages/ChangePassword";
import DeviceList from "@/pages/groups/house/space/device/deviceList";
import NotificationList from "@/pages/notification/notificationList";
import TicketList from "@/pages/ticket/ticketList";

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
        path: '/forgot-password',
        element: <ForgotPassword />
    },
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            { path: '/', element: <IoTDashboard /> },
            { path: '/groups', element: <Groups /> },
            {
                path: '/EditGroup',
                element: <EditGroups />
            },
            {
                path: '/ListSpace',
                element: <SpaceList />
            },
            {
                path:'/devices',
                element: <DeviceList />
            },
            {
                path: '/profile', element: <Profile />

            },
            {
                path: '/change-password',
                element: <ChangePassword />
            },
            {
              path: '/notifications',
              element: <NotificationList />  
            },
            {
                path: '/ticket',
                element: <TicketList />
            },
            // { path: '/settings', element: <Settings /> },
            { path: '/components', element: <ComponentExamples /> }
        ]
    }
]);