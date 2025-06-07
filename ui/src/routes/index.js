import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import DefaultLayout from "@/components/layout/defaultLayout";
import Groups from "@/pages/groups/groupsList";
import Profile from "@/pages/Profile";
import ComponentExamples from "@/pages/ComponentExamples";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import EditGroups from "@/pages/groups/groupsEdit";
import IoTDashboard from "@/pages/home/Home";
import ChangePassword from "@/pages/ChangePassword";
import NotificationList from "@/pages/notification/notificationList";
import TicketList from "@/pages/ticket/ticketList";
import DefaultLayoutAdmin from "@/components/layout/defaultLayoutAdmin";
import AdminTicketsDashboard from "@/pages/admin/ticket_manager/ticket-list-manager";
import NotFoundPage from "@/pages/404";
import HouseList from "@/pages/house/houseList";
import SpaceList from "@/pages/space/spaceList";
import AlarmControlDialog from "@/pages/device-dialogs/alarm-control-dialog";
import AdminCustomerDashboard from "@/pages/admin/customer_manager/customerList";
import SearchDevice from "@/pages/admin/search/searchDevice";
import SearchGroup from "@/pages/admin/search/searchGroup";

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
        path: '/admin',
        element: <DefaultLayoutAdmin />,
        children: [
            {
                path: 'tickets',
                element: <AdminTicketsDashboard />
            },
            {
                path: 'customers',
                element: <AdminCustomerDashboard />
            },
            {
                path: 'search-device',
                element: <SearchDevice />
            },
            {
                path: 'search-group',
                element: <SearchGroup />
            },
            {
                path: '*',
                element: <NotFoundPage />
            },
        ]
    },
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            { path: '/', element: <IoTDashboard /> },
            {
                path: '/groups', element: <Groups />,
            },
            {
                path: '/EditGroup',
                element: <EditGroups />
            },
            {
                path: '/house',
                element: <HouseList />
            },
            {
                path: '/spaces',
                element: <SpaceList />,
            },
            {
                path: '/profile',
                element: <Profile />,
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
            {
                path: '*',
                element: <NotFoundPage />
            },
            // { path: '/settings', element: <Settings /> },
            { path: '/components', element: <ComponentExamples /> }
        ]
    }
]);