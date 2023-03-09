// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Brands from "layouts/brands";
import AddSale from "layouts/addSale";
import Banks from "layouts/banks";
import Categories from "layouts/categories";
import Carousels from "layouts/carousels";
import Discounts from "layouts/discounts";
import Notifications from "layouts/notifications/Notifications";
import SendNotifications from "layouts/notifications/SendNotifications";
import Signup from "layouts/authentication/users/Signup"

//auth routes
import BrandsDetail from "layouts/brands/components/Detail"
import BanksDetail from "layouts/banks/components/Detail"
import SalesDetail from "layouts/addSale/components/Detail"
import CarouselsDetail from "layouts/carousels/components/Detail"
import DiscountsDetail from "layouts/discounts/components/Detail"

// @mui icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CategoryIcon from '@mui/icons-material/Category';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import LoginIcon from '@mui/icons-material/Login';
import Icon from "@mui/material/Icon";
import * as React from 'react'
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";

const AdminAuthRoutes = ({ children }) => {
  const { role } = useContext(AuthContext)
  return role === "admin" ? children : <Navigate to="/login" />
}
const BrandAuthRoutes = ({ children }) => {
  const { role } = useContext(AuthContext)
  return role === "brand" ? children : <Navigate to="/login" />
}
const BankAuthRoutes = ({ children }) => {
  const { role } = useContext(AuthContext)
  return role === "bank" ? children : <Navigate to="/login" />
}

const routes = [
  {
    routeRole: "admin",
    type: "collapse",
    name: "Demo Dashboard",
    key: "admin/dashboard",
    icon: <DashboardIcon />,
    route: "/admin/dashboard",
    component: <AdminAuthRoutes><Dashboard /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: "Brands",
    key: "admin/brands",
    icon: <StoreIcon />,
    route: "/admin/brands",
    component: <AdminAuthRoutes><Brands /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: "Add Sale",
    key: "admin/addSale",
    icon: <InventoryIcon />,
    route: "/admin/addSale",
    component: <AdminAuthRoutes><AddSale /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: "Banks",
    key: "admin/banks",
    icon: <AccountBalanceIcon />,
    route: "/admin/banks",
    component: <AdminAuthRoutes><Banks /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: "Categories",
    key: "admin/categories",
    icon: <CategoryIcon />,
    route: "/admin/categories",
    component: <AdminAuthRoutes><Categories /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: "Carousels",
    key: "admin/carousels",
    icon: <ViewCarouselIcon />,
    route: "/admin/carousels",
    component: <AdminAuthRoutes><Carousels /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: "Discounts",
    key: "admin/discounts",
    icon: <Icon>discounts</Icon>,
    route: "/admin/discounts",
    component: <AdminAuthRoutes><Discounts /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: `Notifications`,
    key: "admin/notifications",
    icon: <NotificationsActiveIcon />,
    route: "/admin/notifications",
    component: <AdminAuthRoutes><Notifications /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: "Signup",
    icon: <LoginIcon />,
    route: "/admin/signup",
    component: <AdminAuthRoutes><Signup /></AdminAuthRoutes>,
  },
  {
    routeRole: "brand",
    type: "collapse",
    name: "Demo Dashboard",
    key: "brand/dashboard",
    icon: <DashboardIcon />,
    route: "/brand/dashboard",
    component: <BrandAuthRoutes><Dashboard /></BrandAuthRoutes>
  },
  {
    routeRole: "brand",
    type: "collapse",
    name: "Add Sale",
    key: "brand/addSale",
    icon: <InventoryIcon />,
    route: "/brand/addSale",
    component: <BrandAuthRoutes><AddSale /></BrandAuthRoutes>,
  },
  {
    routeRole: "brand",
    type: "collapse",
    name: `Send Notifications`,
    key: "brand/sendNotifications",
    icon: <NotificationAddIcon />,
    route: "/brand/sendNotifications",
    component: <BrandAuthRoutes><SendNotifications /></BrandAuthRoutes>,
  },
  {
    routeRole: "bank",
    type: "collapse",
    name: "Demo Dashboard",
    key: "bank/dashboard",
    icon: <DashboardIcon />,
    route: "/bank/dashboard",
    component: <BankAuthRoutes><Dashboard /></BankAuthRoutes>,
  },
  {
    routeRole: "bank",
    type: "collapse",
    name: "Discounts",
    key: "bank/discounts",
    icon: <Icon>discounts</Icon>,
    route: "/bank/discounts",
    component: <BankAuthRoutes><Discounts /></BankAuthRoutes>,
  },
  {
    routeRole: "bank",
    type: "collapse",
    name: `Send Notification`,
    key: "bank/sendNotificationst",
    icon: <NotificationAddIcon />,
    route: "/bank/sendNotifications",
    component: <BankAuthRoutes><SendNotifications /></BankAuthRoutes>,
  },
]

const authRoutes = [
  {
    routeRole: "admin",
    type: "authRoutes",
    route: "/admin/brands/detail/:id",
    component: <AdminAuthRoutes><BrandsDetail /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "authRoutes",
    route: "/admin/banks/detail/:id",
    component: <AdminAuthRoutes><BanksDetail /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "authRoutes",
    route: `/admin/addSale/detail/:id`,
    component: <AdminAuthRoutes><SalesDetail /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "authRoutes",
    route: "/admin/carousels/detail/:id",
    component: <AdminAuthRoutes><CarouselsDetail /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "authRoutes",
    route: "/admin/discounts/detail/:id",
    component: <AdminAuthRoutes><DiscountsDetail /></AdminAuthRoutes>,
  },
  {
    routeRole: "brand",
    type: "authRoutes",
    route: `/brand/addSale/detail/:id`,
    component: <BrandAuthRoutes><SalesDetail /></BrandAuthRoutes>,
  },
  {
    routeRole: "bank",
    type: "authRoutes",
    route: "/bank/discounts/detail/:id",
    component: <BankAuthRoutes><DiscountsDetail /></BankAuthRoutes>,
  },
]
export default routes;
export { authRoutes }
