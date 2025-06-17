import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/User/auth/Login";
import Register from "../pages/User/auth/Register";
import DefaultLayout from "@/components/layout/defaultLayout";
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
import AdminTicketsDashboard from "@/pages/admin/ticket_manager/ticket-list-manager";
import NotFoundPage from "@/pages/User/404";
import HouseList from "@/pages/User/house/houseList";
import SpaceList from "@/pages/User/space/spaceList";
import AdminCustomerDashboard from "@/pages/admin/customer_manager/customerList";
import SearchDevice from "@/pages/admin/search/searchDevice";
import SearchGroup from "@/pages/admin/search/searchGroup";
import UserActivity from "@/pages/User/setting/user-activity";
import DeviceSharingList from "@/pages/User/share/shareDeviceList";
import SearchCustomerGroups from "@/pages/admin/search/searchCustomerGroups";
import SearchCustomerHouses from "@/pages/admin/search/searchCustomerHouses";
import SearchCustomerSpaces from "@/pages/admin/search/searchCustomerSpaces";
import SearchCustomerDevices from "@/pages/admin/search/searchCustomerDevices";
import SearchCustomerInfo from "@/pages/admin/search/searchCustomerInfo";

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
                path: '',
                element: <DashboardAdmin />
            },
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
                path: 'search-device',
                element: <SearchDevice />
            },
            {
                path: 'search-group',
                element: <SearchGroup />
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
                path: '*',
                element: <NotFoundPage />
            },
            // { path: '/settings', element: <Settings /> },
            { path: '/components', element: <ComponentExamples /> }
        ]
    }
]);