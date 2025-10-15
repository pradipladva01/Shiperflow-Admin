import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { retry } from "../common/common-functions";
import SuperAdminSidebar from "../layouts/SuperAdminSidebar";
import SuperAdminRoutes from "./SuperAdminRoutes";

const Login = lazy(() => retry(() => import("../pages/Login")));
const Register = lazy(() => retry(() => import("../pages/Register")));

const Routes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Navigate replace to="/admin/login" />,
    },
    {
      path: "/admin/login",
      element: <Login />,
    },
    {
      path: "/admin/register",
      element: <Register />,
    },
    {
      path: "/super-admin/*",
      element: <SuperAdminSidebar />,
      children: [{ path: "*", element: <SuperAdminRoutes /> }],
    },

    { path: "*", element: <Navigate replace to="/admin/login" /> },
  ]);

  return routes;
};

export default Routes;
