import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { retry } from "../common/common-functions";
import SuperAdminCodRemittanceDetails from "../pages/SuperAdminCodRemittanceDetails";
import SuperAdminShipments from "../pages/SuperAdminShipments";
import SuperAdminOrders from "../pages/SuperAdminOrders";
import SuperAdminShipmentCharges from "../pages/SuperAdminShipmentCharges";

const SuperAdminDashboard = lazy(() =>
  retry(() => import("../pages/SuperAdminDashboard"))
);
const SuperAdminCodRemittance = lazy(() =>
  retry(() => import("../pages/SuperAdminCodRemittance"))
);
const SuperAdminSettings = lazy(() =>
  retry(() => import("../pages/SuperAdminSettings"))
);
const SuperAdminMerchant = lazy(() =>
  retry(() => import("../pages/SuperAdminMerchant"))
);
const MerchantViewDetails = lazy(() =>
  retry(() => import("../pages/MerchantViewDetails"))
);
const SuperAdmin404 = lazy(() => retry(() => import("../pages/SuperAdmin404")));
const SuperAdminRateCard = lazy(() =>
  retry(() => import("../pages/SuperAdminRateCard"))
);
const SuperAdminRoutes = () => {
  const route = useRoutes([
    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },
    {
      path: "dashboard",
      element: <SuperAdminDashboard />,
    },
    {
      path: "orders",
      element: <SuperAdminOrders />,
    },
    {
      path: "shipments",
      element: <SuperAdminShipments />,
    },
    {
      path: "weight-discrepancies",
      element: <SuperAdminShipmentCharges />,
    },
    {
      path: "shipping-charges",
      element: <SuperAdminShipmentCharges />,
    },
    {
      path: "cod-remittance",
      element: <SuperAdminCodRemittance />,
    },
    {
      path: "cod-remittance/:merchantSlug",
      element: <SuperAdminCodRemittanceDetails />,
    },
    {
      path: "merchants",
      element: <SuperAdminMerchant />,
    },
    {
      path: "rate-card",
      element: <SuperAdminRateCard />,
    },
    {
      path: "merchants/:merchantId",
      element: <MerchantViewDetails />,
    },
    {
      path: "settings",
      element: <SuperAdminSettings />,
    },
    {
      path: "404",
      element: <SuperAdmin404 />,
    },
    {
      path: "*",
      element: <Navigate to="/super-admin/404" replace />,
    },
  ]);
  return route;
};

export default SuperAdminRoutes;
