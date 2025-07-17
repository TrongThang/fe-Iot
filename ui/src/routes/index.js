import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/User/auth/Login";
import Register from "../pages/User/auth/Register";
import DefaultLayout from "@/components/layout/defaultLayout";
import Devices from "@/pages/User/devices/deviceManagement";
import Groups from "@/pages/User/groups/groupsList";
import Profile from "@/pages/User/Profile";
import ComponentExamples from "@/pages/User/ComponentExamples";
import ForgotPassword from "@/pages/User/auth/ForgotPassword";
import EditGroups from "@/pages/User/groups/groupsEdit";
import IoTDashboard from "@/pages/User/home/Home";
import ChangePassword from "@/pages/User/ChangePassword";
import NotificationList from "@/pages/User/notification/notificationList";
import TicketList from "@/pages/User/ticket/ticketList";
import DefaultLayoutAdmin from "@/components/layout/defaultLayoutAdmin";
import AdminTicketsDashboard from "@/pages/Admin/ticket_manager/ticket-list-manager";
import NotFoundPage from "@/pages/User/404";
import HouseList from "@/pages/User/house/houseList";
import SpaceList from "@/pages/User/space/spaceList";
import AdminCustomerDashboard from "@/pages/Admin/customer_manager/customerList";
import UserActivity from "@/pages/User/setting/user-activity";
import DeviceSharingList from "@/pages/User/share/shareDeviceList";
import SearchCustomerGroups from "@/pages/Admin/search/searchCustomerGroups";
import SearchCustomerHouses from "@/pages/Admin/search/searchCustomerHouses";
import SearchCustomerSpaces from "@/pages/Admin/search/searchCustomerSpaces";
import SearchCustomerDevices from "@/pages/Admin/search/searchCustomerDevices";
import SearchCustomerInfo from "@/pages/Admin/search/searchCustomerInfo";
import CustomerShare from "@/pages/Admin/customer_manager/customerShareList";
import FCMTestPage from "@/pages/User/FCMTestPage";
import LoginAdmin from "@/pages/Admin/auth/Login_admin";
import DeviceLinksPage from "@/pages/User/DeviceLinksPage";
import AdminWelcome from "@/pages/Admin/Wellcome";

export const router = createBrowserRouter([
    {
        path: '/fcm-test',
        element: <FCMTestPage />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: 'admin/login',
        element: <LoginAdmin />
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
        path: '/Admin',
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
                path: 'share-permissions',
                element: <CustomerShare />
            },
            {
                path: 'search-customer-info',
                element: <SearchCustomerInfo />
            },
            {
                path: 'search-customer-groups',
                element: <SearchCustomerGroups />
            },
            {
                path: 'search-customer-houses',
                element: <SearchCustomerHouses />
            },
            {
                path: 'search-customer-spaces',
                element: <SearchCustomerSpaces />
            },
            {
                path: 'search-customer-devices',
                element: <SearchCustomerDevices />
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
                path: '/devices', element: <Devices />,
            },
            {
                path: '/groups', element: <Groups />,
            },
            {
                path: '/editGroup/:id',
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
                path: '/settings',
                element: <UserActivity />
            },
            {
                path: '/share/device-sharing-list',
                element: <DeviceSharingList />
            },
            {
                path: '/device-links',
                element: <DeviceLinksPage />
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