import React, { useEffect, useRef, useState } from "react";
import RippleButton from "../components/RippleButton";
import { ReactComponent as ThreeDot } from "../resources/icons/Three_dot.svg";

const SuperAdminDashboard = () => {
  const dropdownRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  // Dashboard data from the image
  const cardData = [
    {
      title: "Total Orders",
      value: "12,847",
      status: "good",
      change: "+8.2%",
      color: "#2ca87f",
    },
    {
      title: "Delivered Orders",
      value: "87.3%",
      status: "warning",
      change: "-2.1%",
      color: "#f59e0b",
    },
    {
      title: "RTO Rate",
      value: "8.7%",
      status: "critical",
      change: "+1.2%",
      color: "#ef4444",
    },
    {
      title: "COD Collected",
      value: "₹2,45,890",
      status: "good",
      change: "+12.5%",
      color: "#2ca87f",
    },
    {
      title: "Pending Payouts",
      value: "₹1,23,456",
      status: "warning",
      change: "+5.3%",
      color: "#f59e0b",
    },
    {
      title: "Active Merchants",
      value: "1,247",
      status: "good",
      change: "+3.1%",
      color: "#2ca87f",
    },
    {
      title: "Courier SLA Breach",
      value: "12.4%",
      status: "critical",
      change: "+2.8%",
      color: "#ef4444",
    },
  ];

  // Orders Trend (Daily) data
  const ordersTrendData = [
    { date: "Jan 1", total: 1200, delivered: 1050, deliveryRate: 87.5 },
    { date: "Jan 2", total: 1350, delivered: 1180, deliveryRate: 87.4 },
    { date: "Jan 3", total: 1100, delivered: 960, deliveryRate: 87.3 },
    { date: "Jan 4", total: 1450, delivered: 1260, deliveryRate: 86.9 },
    { date: "Jan 5", total: 1600, delivered: 1400, deliveryRate: 87.5 },
    { date: "Jan 6", total: 1380, delivered: 1200, deliveryRate: 87.0 },
    { date: "Jan 7", total: 1520, delivered: 1330, deliveryRate: 87.5 },
  ];

  // Order Status Distribution data
  const statusDistributionData = [
    { status: "Delivered", count: 8380, percentage: 87.3, color: "#22c55e" },
    { status: "In Transit", count: 870, percentage: 9.1, color: "#f59e0b" },
    { status: "RTO", count: 275, percentage: 2.9, color: "#ef4444" },
    { status: "NDR", count: 75, percentage: 0.8, color: "#8b5cf6" },
  ];

  // Merchant Analytics data
  const topMerchantsByOrders = [
    { name: "Fashion Hub", orders: 2450 },
    { name: "Tech Store", orders: 1890 },
    { name: "Home Decor", orders: 1650 },
    { name: "Sports Gear", orders: 1420 },
    { name: "Beauty Products", orders: 1280 },
  ];

  const topMerchantsByCOD = [
    { name: "Fashion Hub", codValue: "₹1,25,000" },
    { name: "Tech Store", codValue: "₹98,000" },
    { name: "Home Decor", codValue: "₹87,500" },
    { name: "Sports Gear", codValue: "₹76,000" },
    { name: "Beauty Products", codValue: "₹65,000" },
  ];

  const highestRTOAlert = {
    name: "Beauty Products",
    rtoRate: "15.2%",
    orders: 1280,
    delivered: "78.5%",
    status: "suspended",
  };

  // Courier Performance Metrics data
  const courierPerformanceData = [
    {
      name: "FastTrack Express",
      orders: 4500,
      deliveredPercentage: 92.8,
      rtoPercentage: 4.2,
      avgDeliveryDays: 2.3,
      avgCostPerShipment: 45,
      slaBreachPercentage: 8.5,
      hasWarning: false,
    },
    {
      name: "QuickShip Logistics",
      orders: 3800,
      deliveredPercentage: 89.5,
      rtoPercentage: 6.8,
      avgDeliveryDays: 2.8,
      avgCostPerShipment: 42,
      slaBreachPercentage: 12.3,
      hasWarning: false,
    },
    {
      name: "Reliable Delivery",
      orders: 3200,
      deliveredPercentage: 85.2,
      rtoPercentage: 9.1,
      avgDeliveryDays: 3.2,
      avgCostPerShipment: 38,
      slaBreachPercentage: 18.7,
      hasWarning: true,
    },
    {
      name: "Swift Couriers",
      orders: 2900,
      deliveredPercentage: 91.3,
      rtoPercentage: 5.5,
      avgDeliveryDays: 2.5,
      avgCostPerShipment: 48,
      slaBreachPercentage: 9.8,
      hasWarning: false,
    },
  ];

  // COD Management data
  const codManagementData = [
    {
      title: "COD Collected",
      value: "₹4,51,500",
      subtitle: "This cycle",
      color: "#22c55e",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
    {
      title: "COD Released",
      value: "₹3,28,000",
      subtitle: "72.6% of collected",
      color: "#3b82f6",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 6V12L16 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: "Pending COD",
      value: "₹1,23,500",
      subtitle: "",
      color: "#f59e0b",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 8V12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 16H12.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      button: {
        text: "Release COD",
        variant: "primary",
      },
    },
    {
      title: "Upcoming Invoices",
      value: "28",
      subtitle: "",
      color: "#8b5cf6",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M14 2V8H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 13H8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M16 17H8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10 9H8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      button: {
        text: "Generate Report",
        variant: "secondary",
      },
    },
  ];

  // COD Inflow vs Outflow Weekly data
  const codInflowOutflowData = [
    { week: 1, inflow: 85000, outflow: 65000 },
    { week: 2, inflow: 92000, outflow: 78000 },
    { week: 3, inflow: 88000, outflow: 82000 },
    { week: 4, inflow: 95000, outflow: 85000 },
    { week: 5, inflow: 102000, outflow: 88000 },
    { week: 6, inflow: 98000, outflow: 92000 },
    { week: 7, inflow: 105000, outflow: 95000 },
  ];

  // Calculate max value for progress bar scaling
  const maxCodValue = Math.max(
    ...codInflowOutflowData.flatMap((week) => [week.inflow, week.outflow])
  );

  // Quick Finance Actions data
  const quickFinanceActions = [
    {
      title: "Process Payouts",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V8C2 6.9 2.9 6 4 6Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
          <path
            d="M6 14H10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      variant: "primary",
    },
    {
      title: "Generate Invoice",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M14 2V8H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      variant: "secondary",
    },
    {
      title: "Wallet Management",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 6V12L16 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      variant: "secondary",
    },
    {
      title: "Payment Alerts",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 8V12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 16H12.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      variant: "secondary",
    },
  ];

  // Quick Actions data
  const quickActions = [
    {
      title: "Add New Merchant",
      subtitle: "Onboard a new merchant",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M20 8V14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M23 11H17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      color: "#3b82f6",
    },
    {
      title: "Generate Invoice Report",
      subtitle: "Create financial reports",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M14 2V8H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 13H8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M16 17H8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      color: "#22c55e",
    },
    {
      title: "Manage Courier Priority",
      subtitle: "Update courier settings",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 3H15L22 12L15 21H1V3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 12H10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      color: "#8b5cf6",
    },
    {
      title: "Trigger COD Payout",
      subtitle: "Process pending payouts",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V8C2 6.9 2.9 6 4 6Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      color: "#f59e0b",
    },
    {
      title: "Manage Orders",
      subtitle: "View and update orders",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 16V8C21 7.46957 20.7893 6.96086 20.4142 6.58579C20.0391 6.21071 19.5304 6 19 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V16C3 16.5304 3.21071 17.0391 3.58579 17.4142C3.96086 17.7893 4.46957 18 5 18H19C19.5304 18 20.0391 17.7893 20.4142 17.4142C20.7893 17.0391 21 16.5304 21 16Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M7 10H17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M7 14H13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      color: "#6366f1",
    },
    {
      title: "Advanced Analytics",
      subtitle: "Detailed performance metrics",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 20V10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 20V4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6 20V14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      color: "#06b6d4",
    },
    {
      title: "Export Data",
      subtitle: "Download reports and data",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 10L12 15L17 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 15V3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      color: "#f97316",
    },
    {
      title: "System Settings",
      subtitle: "Configure platform settings",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          <path
            d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77251 19.9887C9.5799 19.7201 9.31074 19.5166 9 19.41C8.69838 19.2769 8.36381 19.2372 8.03941 19.296C7.71502 19.3548 7.41568 19.5095 7.18 19.74L7.12 19.8C6.93425 19.986 6.71368 20.1335 6.47088 20.2341C6.22808 20.3348 5.96783 20.3866 5.705 20.3866C5.44217 20.3866 5.18192 20.3348 4.93912 20.2341C4.69632 20.1335 4.47575 19.986 4.29 19.8C4.10405 19.6143 3.95653 19.3937 3.85588 19.1509C3.75523 18.9081 3.70343 18.6478 3.70343 18.385C3.70343 18.1222 3.75523 17.8619 3.85588 17.6191C3.95653 17.3763 4.10405 17.1557 4.29 16.97L4.35 16.91C4.58054 16.6743 4.73519 16.375 4.794 16.0506C4.85282 15.7262 4.81312 15.3916 4.68 15.09C4.55324 14.7942 4.34276 14.542 4.07447 14.3643C3.80618 14.1866 3.49179 14.0913 3.17 14.09H3C2.46957 14.09 1.96086 13.8793 1.58579 13.5042C1.21071 13.1291 1 12.6204 1 12.09C1 11.5596 1.21071 11.0509 1.58579 10.6758C1.96086 10.3007 2.46957 10.09 3 10.09H3.17C3.49179 10.0887 3.80618 9.99342 4.07447 9.81572C4.34276 9.63803 4.55324 9.38579 4.68 9.09C4.81312 8.78838 4.85282 8.45381 4.794 8.12941C4.73519 7.80502 4.58054 7.50568 4.35 7.27L4.29 7.21C4.10405 7.02425 3.95653 6.80368 3.85588 6.56088C3.75523 6.31808 3.70343 6.05783 3.70343 5.795C3.70343 5.53217 3.75523 5.27192 3.85588 5.02912C3.95653 4.78632 4.10405 4.56575 4.29 4.38C4.47575 4.19405 4.69632 4.04653 4.93912 3.94588C5.18192 3.84523 5.44217 3.79343 5.705 3.79343C5.96783 3.79343 6.22808 3.84523 6.47088 3.94588C6.71368 4.04653 6.93425 4.19405 7.12 4.38L7.18 4.44C7.41568 4.67054 7.71502 4.82519 8.03941 4.884C8.36381 4.94282 8.69838 4.90312 9 4.77C9.31074 4.66337 9.5799 4.45985 9.77251 4.19126C9.96512 3.92267 10.0723 3.60097 10.08 3.27V3C10.08 2.46957 10.2907 1.96086 10.6658 1.58579C11.0409 1.21071 11.5496 1 12.08 1C12.6104 1 13.1191 1.21071 13.4942 1.58579C13.8693 1.96086 14.08 2.46957 14.08 3V3.09C14.0813 3.41179 14.1766 3.72618 14.3543 3.99447C14.532 4.26276 14.7842 4.47324 15.08 4.6C15.3816 4.73312 15.7162 4.77282 16.0406 4.714C16.365 4.65519 16.6643 4.50054 16.9 4.27L16.96 4.21C17.1457 4.02405 17.3663 3.87653 17.6091 3.77588C17.8519 3.67523 18.1122 3.62343 18.375 3.62343C18.6378 3.62343 18.8981 3.67523 19.1409 3.77588C19.3837 3.87653 19.6043 4.02405 19.79 4.21C19.976 4.39575 20.1235 4.61632 20.2241 4.85912C20.3248 5.10192 20.3766 5.36217 20.3766 5.625C20.3766 5.88783 20.3248 6.14808 20.2241 6.39088C20.1235 6.63368 19.976 6.85425 19.79 7.04L19.73 7.1C19.4995 7.33568 19.3448 7.63502 19.286 7.95941C19.2272 8.28381 19.2669 8.61838 19.4 8.92C19.5166 9.23026 19.72 9.49942 19.9887 9.69203C20.2573 9.88464 20.579 9.99185 20.91 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.579 14.0082 20.2573 14.1154 19.9887 14.308C19.72 14.5006 19.5166 14.7697 19.4 15.08V15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: "#6b7280",
    },
  ];

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpenDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="dashboard_section">
        <div className="page_header">
          <h1>Super Admin Dashboard</h1>
        </div>
        <div className="page_content">
          <div className="super_admin_order_flows">
            {cardData.map((card, index) => (
              <div className="order_card" key={index}>
                <div className="card_header">
                  <h6>{card.title}</h6>
                  <div className={`status_badge ${card.status}`}>
                    {card.status}
                  </div>
                </div>
                <div className="card_content">
                  <p style={{ color: card.color }}>{card.value}</p>
                  <div
                    className={`change_indicator ${
                      card.change.startsWith("+") ? "positive" : "negative"
                    }`}
                  >
                    {card.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="orders_trend_list_main">
            <div className="revenue_all_time">
              <div className="top_bar">
                <h6>Orders Trend (Daily)</h6>
                <div className="dropdown_main" ref={dropdownRef}>
                  <RippleButton
                    className="revenue_all_time_btn"
                    onClick={() => setOpenDropdown((prev) => !prev)}
                  >
                    <ThreeDot />
                  </RippleButton>
                  {openDropdown && (
                    <div className="dropdown_menu">
                      <RippleButton className="dropdown_item">
                        7 Days
                      </RippleButton>
                    </div>
                  )}
                </div>
              </div>

              <div className="orders_trend_list">
                {ordersTrendData.map((day, index) => (
                  <div key={index} className="trend_item">
                    <div className="trend_date">{day.date}</div>
                    <div className="trend_data">
                      <span>Total: {day.total}</span>
                      <span className="delivered_orders">
                        Delivered: {day.delivered}
                      </span>
                    </div>
                    <div className="delivery_rate">
                      <span>{day.deliveryRate}%</span>
                      <div className="progress_bar">
                        <div
                          className="progress_fill"
                          style={{
                            width: `${day.deliveryRate}%`,
                            backgroundColor: "#22c55e",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order_status">
              <h6>Order Status Distribution</h6>
              <div className="status_total">
                <span>Total Orders: 9,600</span>
              </div>
              <div className="status_distribution">
                {statusDistributionData.map((item, index) => (
                  <div key={index} className="status_item">
                    <div className="status_info">
                      <div
                        className="status_indicator"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="status_name">{item.status}</span>
                    </div>
                    <div className="status_values">
                      <span className="status_count">
                        {item.count.toLocaleString()}
                      </span>
                      <span className="status_percentage">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="status_progress_bar">
                      <div
                        className="status_progress_fill"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Merchant Performance Summary Table */}
          <div className="merchant_performance_section">
            <div className="section_header">
              <h6>Merchant Performance Summary</h6>
              <RippleButton className="export_btn">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 15L8 11H10.5V3H13.5V11H16L12 15Z"
                    fill="currentColor"
                  />
                  <path d="M20 18H4V20H20V18Z" fill="currentColor" />
                </svg>
                Export
              </RippleButton>
            </div>
            <div className="table_container">
              <table className="merchant_performance_table">
                <thead>
                  <tr>
                    <th className="sortable">
                      Merchant Name
                      <svg
                        className="sort_icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                    </th>
                    <th className="sortable">
                      Orders
                      <svg
                        className="sort_icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                    </th>
                    <th className="sortable">
                      Delivered %
                      <svg
                        className="sort_icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                    </th>
                    <th className="sortable">
                      COD Collected
                      <svg
                        className="sort_icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                    </th>
                    <th className="sortable">
                      Pending Payout
                      <svg
                        className="sort_icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                    </th>
                    <th className="sortable">
                      RTO %
                      <svg
                        className="sort_icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                    </th>
                    <th className="sortable">
                      Status
                      <svg
                        className="sort_icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Fashion Hub</td>
                    <td>2,450</td>
                    <td>
                      <span className="performance_badge good">92.5%</span>
                    </td>
                    <td>₹1,25,000</td>
                    <td>₹15,000</td>
                    <td>
                      <span className="performance_badge warning">5.2%</span>
                    </td>
                    <td>
                      <span className="status_badge active">active</span>
                    </td>
                    <td>
                      <RippleButton className="action_btn">
                        <ThreeDot />
                      </RippleButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Tech Store</td>
                    <td>1,890</td>
                    <td>
                      <span className="performance_badge warning">88.7%</span>
                    </td>
                    <td>₹98,000</td>
                    <td>₹12,000</td>
                    <td>
                      <span className="performance_badge warning">7.8%</span>
                    </td>
                    <td>
                      <span className="status_badge active">active</span>
                    </td>
                    <td>
                      <RippleButton className="action_btn">
                        <ThreeDot />
                      </RippleButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Home Decor</td>
                    <td>1,650</td>
                    <td>
                      <span className="performance_badge warning">85.3%</span>
                    </td>
                    <td>₹87,500</td>
                    <td>₹18,000</td>
                    <td>
                      <span className="performance_badge warning">9.2%</span>
                    </td>
                    <td>
                      <span className="status_badge active">active</span>
                    </td>
                    <td>
                      <RippleButton className="action_btn">
                        <ThreeDot />
                      </RippleButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Sports Gear</td>
                    <td>1,420</td>
                    <td>
                      <span className="performance_badge good">90.1%</span>
                    </td>
                    <td>₹76,000</td>
                    <td>₹8,500</td>
                    <td>
                      <span className="performance_badge warning">6.1%</span>
                    </td>
                    <td>
                      <span className="status_badge active">active</span>
                    </td>
                    <td>
                      <RippleButton className="action_btn">
                        <ThreeDot />
                      </RippleButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Beauty Products</td>
                    <td>1,280</td>
                    <td>
                      <span className="performance_badge critical">78.5%</span>
                    </td>
                    <td>₹65,000</td>
                    <td>₹22,000</td>
                    <td>
                      <span className="performance_badge critical">15.2%</span>
                    </td>
                    <td>
                      <span className="status_badge suspended">suspended</span>
                    </td>
                    <td>
                      <RippleButton className="action_btn">
                        <ThreeDot />
                      </RippleButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Merchant Analytics Section */}
          <div className="merchant_analytics_section">
            <div className="top_merchants_by_orders">
              <h6>Top 5 by Orders</h6>
              <div className="merchant_list">
                {topMerchantsByOrders.map((merchant, index) => (
                  <div key={index} className="merchant_item">
                    <span className="merchant_rank">{index + 1}.</span>
                    <span className="merchant_name">{merchant.name}</span>
                    <span className="merchant_value">
                      {merchant.orders.toLocaleString()} orders
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="top_merchants_by_cod">
              <h6>Top 5 by COD Value</h6>
              <div className="merchant_list">
                {topMerchantsByCOD.map((merchant, index) => (
                  <div key={index} className="merchant_item">
                    <span className="merchant_rank">{index + 1}.</span>
                    <span className="merchant_name">{merchant.name}</span>
                    <span className="merchant_value">{merchant.codValue}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="highest_rto_alert">
              <h6 className="alert_title">Highest RTO Alert</h6>
              <div className="alert_content">
                <div className="alert_header">
                  <span className="merchant_name">{highestRTOAlert.name}</span>
                  <span className="rto_rate_badge">
                    {highestRTOAlert.rtoRate} RTO
                  </span>
                </div>
                <div className="alert_details">
                  <div className="detail_item">
                    <span className="detail_label">Orders:</span>
                    <span className="detail_value">
                      {highestRTOAlert.orders.toLocaleString()}
                    </span>
                  </div>
                  <div className="detail_item">
                    <span className="detail_label">Delivered:</span>
                    <span className="detail_value">
                      {highestRTOAlert.delivered}
                    </span>
                  </div>
                  <div className="detail_item">
                    <span className="detail_label">Status:</span>
                    <span className="detail_value status_suspended">
                      {highestRTOAlert.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Courier Performance Metrics Section */}
          <div className="courier_performance_section">
            <div className="section_header">
              <h6>Courier Performance Metrics</h6>
              <RippleButton className="export_btn">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 15L8 11H10.5V3H13.5V11H16L12 15Z"
                    fill="currentColor"
                  />
                  <path d="M20 18H4V20H20V18Z" fill="currentColor" />
                </svg>
                Export
              </RippleButton>
            </div>
            <div className="table_container">
              <table className="courier_performance_table">
                <thead>
                  <tr>
                    <th className="sortable">
                      Courier Name
                      <svg
                        className="sort_icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                    </th>
                    <th className="sortable">
                      Orders
                      <svg
                        className="sort_icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                    </th>
                    <th className="sortable">
                      Delivered %
                      <svg
                        className="sort_icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                    </th>
                    <th className="sortable">
                      RTO %
                      <svg
                        className="sort_icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                    </th>
                    <th className="sortable">
                      Avg Delivery Days
                      <svg
                        className="sort_icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                    </th>
                    <th className="sortable">
                      Avg Cost/Shipment
                      <svg
                        className="sort_icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                    </th>
                    <th className="sortable">
                      SLA Breach %
                      <svg
                        className="sort_icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courierPerformanceData.map((courier, index) => (
                    <tr key={index}>
                      <td>
                        <div className="courier_name_cell">
                          {courier.name}
                          {courier.hasWarning && (
                            <svg
                              className="warning_icon"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 2L22 20H2L12 2Z"
                                fill="#ef4444"
                                stroke="#ef4444"
                                strokeWidth="1"
                              />
                              <path
                                d="M12 8V12M12 16H12.01"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td>{courier.orders.toLocaleString()}</td>
                      <td>
                        <span
                          className={`performance_badge ${
                            courier.deliveredPercentage >= 90
                              ? "good"
                              : courier.deliveredPercentage >= 85
                              ? "warning"
                              : "critical"
                          }`}
                        >
                          {courier.deliveredPercentage}%
                        </span>
                      </td>
                      <td>
                        <span
                          className={`performance_badge ${
                            courier.rtoPercentage <= 5
                              ? "good"
                              : courier.rtoPercentage <= 8
                              ? "warning"
                              : "critical"
                          }`}
                        >
                          {courier.rtoPercentage}%
                        </span>
                      </td>
                      <td>{courier.avgDeliveryDays} days</td>
                      <td>₹{courier.avgCostPerShipment}</td>
                      <td>
                        <span
                          className={`performance_badge ${
                            courier.slaBreachPercentage <= 10
                              ? "good"
                              : courier.slaBreachPercentage <= 15
                              ? "warning"
                              : "critical"
                          }`}
                        >
                          {courier.slaBreachPercentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* COD Management Section */}
          <div className="cod_management_section">
            <div className="cod_cards_grid">
              {codManagementData.map((card, index) => (
                <div key={index} className="cod_card">
                  <div className="cod_card_header">
                    <h6 className="cod_card_title">{card.title}</h6>
                    <div
                      className="cod_card_icon"
                      style={{ color: card.color }}
                    >
                      {card.icon}
                    </div>
                  </div>
                  <div className="cod_card_content">
                    <div
                      className="cod_card_value"
                      style={{ color: card.color }}
                    >
                      {card.value}
                    </div>
                    {card.subtitle && (
                      <div className="cod_card_subtitle">{card.subtitle}</div>
                    )}
                  </div>
                  {card.button && (
                    <div className="cod_card_action">
                      <RippleButton
                        className={`cod_action_btn ${
                          card.button.variant === "primary"
                            ? "primary"
                            : "secondary"
                        }`}
                      >
                        {card.button.text}
                      </RippleButton>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* COD Inflow vs Outflow (Weekly) Section */}
          <div className="cod_inflow_outflow_section">
            <div className="section_header">
              <h6>COD Inflow vs Outflow (Weekly)</h6>
            </div>
            <div className="cod_weekly_data">
              {codInflowOutflowData.map((weekData, index) => (
                <div key={index} className="week_data_row">
                  <div className="week_label">Week {weekData.week}</div>

                  <div className="cod_metrics">
                    <div className="cod_metric">
                      <div className="metric_label">COD Inflow</div>
                      <div className="progress_bar_container">
                        <div className="progress_bar_bg">
                          <div
                            className="progress_bar_fill inflow"
                            style={{
                              width: `${
                                (weekData.inflow / maxCodValue) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="metric_value inflow">
                          Inflow: ₹{weekData.inflow.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="cod_metric">
                      <div className="metric_label">COD Outflow</div>
                      <div className="progress_bar_container">
                        <div className="progress_bar_bg">
                          <div
                            className="progress_bar_fill outflow"
                            style={{
                              width: `${
                                (weekData.outflow / maxCodValue) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="metric_value outflow">
                          Outflow: ₹{weekData.outflow.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="quick_actions_section">
            {/* Quick Finance Actions */}
            <div className="quick_finance_actions">
              <h6>Quick Finance Actions</h6>
              <div className="finance_actions_grid">
                {quickFinanceActions.map((action, index) => (
                  <RippleButton
                    key={index}
                    className={`finance_action_card ${
                      action.variant === "primary" ? "primary" : "secondary"
                    }`}
                  >
                    <div className="action_icon">{action.icon}</div>
                    <div className="action_title">{action.title}</div>
                  </RippleButton>
                ))}
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="quick_actions_grid">
              <h6>Quick Actions</h6>
              <div className="actions_grid">
                {quickActions.map((action, index) => (
                  <RippleButton
                    key={index}
                    className="action_card"
                    style={{ backgroundColor: action.color }}
                  >
                    <div className="action_icon">{action.icon}</div>
                    <div className="action_content">
                      <div className="action_title">{action.title}</div>
                      <div className="action_subtitle">{action.subtitle}</div>
                    </div>
                  </RippleButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
