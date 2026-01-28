import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DollarSign,
  Scale,
  Settings,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";
import { useLogout } from "../utils/hooks/auth/useLogout";
import { ReactComponent as LogoutRedIcon } from "../resources/icons/Logout_Icon.svg";
import { ReactComponent as DashboardIcon } from "../resources/icons/Dashboard_Icon.svg";
import "../styles/admin.scss";
import SuperAdminRoutes from "../routes/SuperAdminRoutes";
import AdminHeader from "./AdminHeader";
import RippleButton from "../components/RippleButton";
import Logo from "../resources/images/Logo.png";
import LogoVersion from "../resources/images/Logo_Version.svg";

const SuperAdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useLogout();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <nav className={`sidebar_main ${isCollapsed ? "active" : ""}`}>
        <div className="navbar_wrapper">
          <div className="top_header">
            <Link to="/super-admin/dashboard" className="logo_link">
              {!isCollapsed ? (
                <img src={Logo} alt="OMS Admin Logo" className="logo_full" />
              ) : (
                <img
                  src={LogoVersion}
                  alt="OMS Logo"
                  className="logo_collapsed"
                />
              )}
            </Link>
          </div>

          <div className="navbar_content">
            <div className="simplebar_wrapper">
              {/* <div className="user_card">
                <div className="card_body">
                  <div className="user_img">
                    <img src={Avatar} alt="User Avatar" />
                    <div className="status_indicator"></div>
                  </div>
                  {!isCollapsed && (
                    <div className="user_name">
                      <h6>{userName}</h6>
                      <span className="user_role">
                        {role === "super-admin"
                          ? "Super Administrator"
                          : role === "merchant"
                          ? "Merchant"
                          : role}
                      </span>
                    </div>
                  )}
                </div>
              </div> */}

              {/* Navigation Menu */}
              <ul className="navbar">
                <li className="navbar_item">
                  <RippleButton
                    to="/super-admin/dashboard"
                    className={`navbar_link dashboard_icon ${
                      location.pathname === "/super-admin/dashboard"
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="icon_wrapper">
                      <DashboardIcon />
                    </div>
                    {!isCollapsed && (
                      <span className="link_text">Dashboard</span>
                    )}
                  </RippleButton>
                </li>
                <li className="navbar_item">
                  <RippleButton
                    to="/super-admin/orders"
                    className={`navbar_link ${
                      location.pathname === "/super-admin/orders"
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="icon_wrapper">
                      <ShoppingCart />
                    </div>
                    {!isCollapsed && <span className="link_text">Orders</span>}
                  </RippleButton>
                </li>
                <li className="navbar_item">
                  <RippleButton
                    to="/super-admin/shipments"
                    className={`navbar_link ${
                      location.pathname === "/super-admin/shipments"
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="icon_wrapper">
                      <Truck />
                    </div>
                    {!isCollapsed && (
                      <span className="link_text">Shipments</span>
                    )}
                  </RippleButton>
                </li>
                <li className="navbar_item">
                  <RippleButton
                    to="/super-admin/weight-discrepancies"
                    className={`navbar_link ${
                      location.pathname === "/super-admin/weight-discrepancies"
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="icon_wrapper">
                      <Scale />
                    </div>
                    {!isCollapsed && (
                      <span className="link_text">Weight Discrepancies</span>
                    )}
                  </RippleButton>
                </li>
                <li className="navbar_item">
                  <RippleButton
                    to="/super-admin/shipping-charges"
                    className={`navbar_link ${
                      location.pathname === "/super-admin/shipping-charges"
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="icon_wrapper">
                      <Scale />
                    </div>
                    {!isCollapsed && (
                      <span className="link_text">Shipping Charges</span>
                    )}
                  </RippleButton>
                </li>
                <li className="navbar_item">
                  <RippleButton
                    to="/super-admin/cod-remittance"
                    className={`navbar_link ${
                      location.pathname === "/super-admin/cod-remittance"
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="icon_wrapper">
                      <DollarSign />
                    </div>
                    {!isCollapsed && (
                      <span className="link_text">COD Remittance</span>
                    )}
                  </RippleButton>
                </li>
                <li className="navbar_item">
                  <RippleButton
                    to="/super-admin/merchants"
                    className={`navbar_link ${
                      location.pathname === "/super-admin/merchants"
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="icon_wrapper">
                      <Users />
                    </div>
                    {!isCollapsed && (
                      <span className="link_text">Merchants</span>
                    )}
                  </RippleButton>
                </li>
                <li className="navbar_item">
                  <RippleButton
                    to="/super-admin/rate-card"
                    className={`navbar_link ${
                      location.pathname === "/super-admin/rate-card"
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="icon_wrapper">
                      <DollarSign />
                    </div>
                    {!isCollapsed && (
                      <span className="link_text">Rate Card</span>
                    )}
                  </RippleButton>
                </li>
                <li className="navbar_item">
                  <RippleButton
                    to="/super-admin/couriers"
                    className={`navbar_link ${
                      location.pathname === "/super-admin/couriers"
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="icon_wrapper">
                      <Truck />
                    </div>
                    {!isCollapsed && (
                      <span className="link_text">Couriers</span>
                    )}
                  </RippleButton>
                </li>
                <li className="navbar_item">
                  <RippleButton
                    to="/super-admin/settings"
                    className={`navbar_link ${
                      location.pathname === "/super-admin/settings"
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="icon_wrapper">
                      <Settings />
                    </div>
                    {!isCollapsed && (
                      <span className="link_text">Settings</span>
                    )}
                  </RippleButton>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Section */}
          <div className="sidebar_footer">
            <RippleButton
              className="navbar_link logout_btn"
              onClick={() => handleLogout()}
            >
              <div className="icon_wrapper">
                <LogoutRedIcon />
              </div>
              {!isCollapsed && <span className="link_text">Log Out</span>}
            </RippleButton>
          </div>
        </div>
      </nav>
      <AdminHeader toggleSidebar={toggleSidebar} collapsed={isCollapsed} />
      <div className={`container_main ${isCollapsed ? "active" : ""}`}>
        <div className="content">
          <SuperAdminRoutes />
        </div>
      </div>
    </>
  );
};

export default SuperAdminSidebar;
