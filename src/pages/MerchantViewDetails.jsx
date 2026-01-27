import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import {
  ArrowLeft,
  UserX,
  Key,
  UserCheck,
  Bell,
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  AlertTriangle,
  IndianRupee,
  Calendar,
  BarChart3,
  Download,
  Plus,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Save,
  FileText,
  Clock,
} from "lucide-react";
import RippleButton from "../components/RippleButton";

// Mock data for merchant details
const merchantDetails = {
  id: "M001",
  businessName: "TechStore India",
  owner: "Rahul Sharma",
  gstin: "29ABCDE1234F1Z5",
  tier: "Premium",
  status: "Active",
  email: "rahul@techstore.com",
  phone: "+91 98765 43210",
  address: "123 Tech Park, Bangalore, Karnataka - 560001",
  registrationDate: "2023-01-15",
  lastActive: "2024-01-15",
  riskScore: 3,
  codCycle: "Weekly",
  pendingCod: 125000,
  totalOrders: 1250,
  deliveredOrders: 1100,
  rtoOrders: 150,
  lifetimeShipping: 450000,
  // Billing & Finance data
  bankDetails: {
    accountNumber: "1234567890",
    ifscCode: "HDFC0001234",
    upiId: "rahul@paytm",
  },
  lastPayout: {
    date: "2024-01-08",
    amount: 75000,
  },
  nextPayout: "2024-01-15",
  adjustments: [
    {
      id: "ADJ001",
      type: "Credit",
      description: "Refund for damaged shipment",
      date: "2024-01-10",
      amount: 5000,
    },
    {
      id: "ADJ002",
      type: "Debit",
      description: "Penalty for Fake RTO",
      date: "2024-01-08",
      amount: 500,
    },
    {
      id: "ADJ003",
      type: "Credit",
      description: "Promotional credit",
      date: "2024-01-05",
      amount: 2000,
    },
  ],
  gstInvoices: [
    {
      id: "INV-2024-001",
      month: "January 2024",
      amount: 45000,
      status: "Paid",
    },
    {
      id: "INV-2023-012",
      month: "December 2023",
      amount: 38000,
      status: "Paid",
    },
    {
      id: "INV-2023-011",
      month: "November 2023",
      amount: 42000,
      status: "Paid",
    },
  ],
  // Shipping Settings data
  shippingSettings: {
    courierPriority: [
      { id: 1, name: "Delhivery", priority: 1 },
      { id: 2, name: "Bluedart", priority: 2 },
      { id: 3, name: "XpressBees", priority: 3 },
    ],
    codEnabled: true,
    customShippingCharges: [
      {
        zone: "Zone A (Local)",
        weight0to500: 40,
        weight500to1kg: 50,
        weight1to2kg: 70,
        codSurcharge: 15,
      },
      {
        zone: "Zone B (Metro)",
        weight0to500: 50,
        weight500to1kg: 65,
        weight1to2kg: 85,
        codSurcharge: 20,
      },
      {
        zone: "Zone C (RoI)",
        weight0to500: 60,
        weight500to1kg: 80,
        weight1to2kg: 110,
        codSurcharge: 25,
      },
      {
        zone: "Zone D (NE)",
        weight0to500: 80,
        weight500to1kg: 100,
        weight1to2kg: 140,
        codSurcharge: 30,
      },
    ],
  },
  // Disputes & Risk data
  disputes: [
    {
      id: "DSP001",
      orderId: "ORD002",
      type: "Weight Discrepancy",
      declaredWeight: "1kg",
      chargedWeight: "1.2kg",
      extraCharges: 50,
      status: "Open",
      date: "2024-01-14",
      description: "Weight discrepancy detected during shipment processing",
    },
    {
      id: "DSP002",
      orderId: "ORD003",
      type: "Weight Discrepancy",
      declaredWeight: "0.8kg",
      chargedWeight: "1kg",
      extraCharges: 25,
      status: "Resolved",
      date: "2024-01-13",
      description: "Weight discrepancy resolved with merchant agreement",
    },
  ],
  riskAssessment: {
    score: 6,
    maxScore: 10,
    level: "Medium Risk",
    rtoPercentage: 12.0,
    weightDiscrepancies: 2,
    pendingCod: 125000,
    openDisputes: 1,
  },
  internalNotes: "",
  // Integration data
  integrations: {
    shopify: {
      apiKey: "sk_test_1234567890abcdef",
      apiSecret: "shpss_1234567890abcdef",
      webhookUrl: "https://api.example.com/webhooks/shopify",
      showApiKey: false,
      status: "active",
      lastTested: "2024-01-15 10:30 AM",
    },
  },
  // Notes & Audit data
  notesHistory: [
    {
      id: "NOTE001",
      content:
        "Merchant requested COD cycle change from monthly to weekly due to cash flow requirements.",
      admin: "Admin Sarah",
      timestamp: "2024-01-10 14:30",
      date: "2024-01-10",
    },
    {
      id: "NOTE002",
      content:
        "High RTO rate observed in December. Merchant contacted for discussion on packaging improvements.",
      admin: "Admin Vishal",
      timestamp: "2024-01-05 11:15",
      date: "2024-01-05",
    },
  ],
  auditLog: [
    {
      id: "AUDIT001",
      dateTime: "2024-01-15 12:30 PM",
      staff: "Admin Vishal",
      action: "COD Cycle Changed",
      oldValue: "Monthly",
      newValue: "Weekly",
      actionType: "update",
    },
    {
      id: "AUDIT002",
      dateTime: "2024-01-14 09:45 AM",
      staff: "Admin Vishal",
      action: "Courier Priority Updated",
      oldValue: "Bluedart, Delhivery",
      newValue: "Delhivery, Bluedart, XpressBees",
      actionType: "update",
    },
    {
      id: "AUDIT003",
      dateTime: "2024-01-12 16:20 PM",
      staff: "Admin Sarah",
      action: "Shipping Charges Modified",
      oldValue: "Zone A: ₹40, ₹50, ₹70",
      newValue: "Zone A: ₹45, ₹55, ₹75",
      actionType: "update",
    },
    {
      id: "AUDIT004",
      dateTime: "2024-01-10 10:15 AM",
      staff: "Admin Vishal",
      action: "Status Changed",
      oldValue: "Inactive",
      newValue: "Active",
      actionType: "status",
    },
  ],
};

// Mock recent orders data
const recentOrders = [
  {
    orderId: "ORD001",
    date: "2024-01-15",
    courier: "Delhivery",
    status: "Delivered",
    declaredWeight: "0.5kg",
    chargedWeight: "0.5kg",
    codAmount: 1500,
    extraCharges: null,
  },
  {
    orderId: "ORD002",
    date: "2024-01-14",
    courier: "Bluedart",
    status: "In Transit",
    declaredWeight: "1kg",
    chargedWeight: "1.2kg",
    codAmount: 2500,
    extraCharges: 50,
    weightDiscrepancy: true,
  },
  {
    orderId: "ORD003",
    date: "2024-01-13",
    courier: "XpressBees",
    status: "Delivered",
    declaredWeight: "0.8kg",
    chargedWeight: "1kg",
    codAmount: 1800,
    extraCharges: 25,
    weightDiscrepancy: true,
  },
  {
    orderId: "ORD004",
    date: "2024-01-12",
    courier: "Delhivery",
    status: "RTO",
    declaredWeight: "2kg",
    chargedWeight: "2kg",
    codAmount: 3500,
    extraCharges: null,
  },
  {
    orderId: "ORD005",
    date: "2024-01-11",
    courier: "Bluedart",
    status: "Pending",
    declaredWeight: "0.3kg",
    chargedWeight: "0.5kg",
    codAmount: 1200,
    extraCharges: 15,
    weightDiscrepancy: true,
  },
];
const pricingData = [
  // Xpressbees New 500 gm
  {
    courier: "Xpressbees New 500 gm",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Xpressbees New 500 gm",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Xpressbees New 500 gm",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Xpressbees New 1 K.G
  {
    courier: "Xpressbees New 1 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Xpressbees New 1 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Xpressbees New 1 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Xpressbees New 2 K.G
  {
    courier: "Xpressbees New 2 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Xpressbees New 2 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Xpressbees New 2 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Ekart Surface 500 gm
  {
    courier: "Ekart Surface 500 gm",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Ekart Surface 500 gm",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Ekart Surface 500 gm",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Ekart Surface 1 K.G
  {
    courier: "Ekart Surface 1 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Ekart Surface 1 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Ekart Surface 1 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Ekart Surface 2 K.G
  {
    courier: "Ekart Surface 2 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Ekart Surface 2 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Ekart Surface 2 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Delhivery Surface (Brand) 500 gm
  {
    courier: "Delhivery Surface (Brand) 500 gm",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Surface (Brand) 500 gm",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Surface (Brand) 500 gm",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Delhivery Surface (Brand) 1 K.G
  {
    courier: "Delhivery Surface (Brand) 1 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Surface (Brand) 1 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Surface (Brand) 1 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Delhivery Surface (Brand) 2 K.G
  {
    courier: "Delhivery Surface (Brand) 2 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Surface (Brand) 2 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Surface (Brand) 2 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Delhivery Lite 500 gm
  {
    courier: "Delhivery Lite 500 gm",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Lite 500 gm",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Lite 500 gm",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Delhivery Lite 1 K.G
  {
    courier: "Delhivery Lite 1 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Lite 1 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Lite 1 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Delhivery Lite 2 K.G
  {
    courier: "Delhivery Lite 2 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Lite 2 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Lite 2 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
];

const MerchantViewDetails = () => {
  const { merchantId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [merchantStatus, setMerchantStatus] = useState(merchantDetails.status);
  // const [activeTab, setActiveTab] = useState("Custom");
  const [data, setData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);

  // Shipping Settings State
  const [courierPriority, setCourierPriority] = useState(
    merchantDetails.shippingSettings.courierPriority
  );
  const [codEnabled, setCodEnabled] = useState(
    merchantDetails.shippingSettings.codEnabled
  );
  const [shippingCharges, setShippingCharges] = useState(
    merchantDetails.shippingSettings.customShippingCharges
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCouriers, setIsLoadingCouriers] = useState(false);

  // Disputes & Risk State
  const [disputesModalOpen, setDisputesModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "penalty" or "refund"
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [modalAmount, setModalAmount] = useState("");
  const [internalNotes, setInternalNotes] = useState(
    merchantDetails.internalNotes
  );
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Integration State
  const [formData, setFormData] = useState({
    integrations: {
      shopify: {
        apiKey: "",
        apiSecret: "",
        webhookUrl: "",
        showApiKey: false,
        status: "inactive",
        lastTested: "Never",
      },
    },
  });

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "billing", label: "Billing & Finance" },
    { id: "rateCard", label: "Rate Card" },
    { id: "orderList", label: "Order List" },
    { id: "shipping", label: "Shipping Settings" },
    { id: "disputes", label: "Disputes & Risk" },
    { id: "notes", label: "Notes & Audit" },
    { id: "integration", label: "Integration" },
  ];

  const courierOptions = [
    { value: "Delhivery Surface", label: "Delhivery Surface" },
    { value: "Delhivery Air", label: "Delhivery Air" },
    { value: "Ekart Surface", label: "Ekart Surface" },
    { value: "Ekart Air", label: "Ekart Air" },
    { value: "Bluedart Surface", label: "Bluedart Surface" },
    { value: "Bluedart Air", label: "Bluedart Air" },
    { value: "Xpressbees Surface", label: "Xpressbees Surface" },
    { value: "Xpressbees Air", label: "Xpressbees Air" },
  ];

  const weightOptions = [
    { value: "0.25 KG", label: "0.25 KG" },
    { value: "0.5 KG", label: "0.5 KG" },
    { value: "1 KG", label: "1 KG" },
    { value: "2 KG", label: "2 KG" },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  // Fetch couriers from API
  useEffect(() => {
    const fetchCouriers = async () => {
      setIsLoadingCouriers(true);
      try {
        const response = await axios.get(
          "https://api.fixoindia.com/public/api/fship/couriers"
        );

        if (response.data && Array.isArray(response.data)) {
          const couriers = response.data.map((courier, index) => ({
            id: courier.id || courier.courier_id || index + 1,
            name:
              courier.name ||
              courier.courier_name ||
              courier.courierName ||
              "Unknown",
            priority: index + 1,
          }));
          setCourierPriority(couriers);
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          // Handle nested data structure
          const couriers = response.data.data.map((courier, index) => ({
            id: courier.id || courier.courier_id || index + 1,
            name:
              courier.name ||
              courier.courier_name ||
              courier.courierName ||
              "Unknown",
            priority: index + 1,
          }));
          setCourierPriority(couriers);
        }
      } catch (error) {
        console.error("Error fetching couriers:", error);
        // Keep existing courierPriority if API fails
      } finally {
        setIsLoadingCouriers(false);
      }
    };

    // Fetch couriers when component mounts
    fetchCouriers();
  }, []);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Delivered":
        return { bg: "#10B981", color: "#10B981" };
      case "In Transit":
        return { bg: "#3B82F6", color: "#3B82F6" };
      case "RTO":
        return { bg: "#EF4444", color: "#EF4444" };
      case "Pending":
        return { bg: "#F59E0B", color: "#F59E0B" };
      default:
        return { bg: "#6B7280", color: "#6B7280" };
    }
  };
  const getStatusAccountColor = (status) => {
    switch (status) {
      case "Active":
        return { bg: "#10B981", color: "#10B981" };
      case "Inactive":
        return { bg: "#EF4444", color: "#EF4444" };
      default:
        return { bg: "#6B7280", color: "#6B7280" };
    }
  };

  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case "Premium":
        return { bg: "#3B82F6", color: "#3B82F6" };
      case "Standard":
        return { bg: "#6B7280", color: "#6B7280" };
      case "Starter":
        return { bg: "#9CA3AF", color: "#9CA3AF" };
      default:
        return { bg: "#374151", color: "#374151" };
    }
  };

  const handleStatusToggle = (event) => {
    const isActive = event.target.checked;
    const newStatus = isActive ? "Active" : "Inactive";
    setMerchantStatus(newStatus);

    // Here you would typically make an API call to update the merchant status
    // Merchant status changed
  };

  // Shipping Settings Handlers
  const handleCourierPriorityChange = (index, direction) => {
    const newPriority = [...courierPriority];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newPriority.length) {
      [newPriority[index], newPriority[targetIndex]] = [
        newPriority[targetIndex],
        newPriority[index],
      ];
      // Update priority numbers
      newPriority.forEach((courier, idx) => {
        courier.priority = idx + 1;
      });
      setCourierPriority(newPriority);
    }
  };

  const handleCodToggle = (event) => {
    setCodEnabled(event.target.checked);
  };

  const handleShippingChargeChange = (zoneIndex, field, value) => {
    const newCharges = [...shippingCharges];
    newCharges[zoneIndex][field] = parseInt(value) || 0;
    setShippingCharges(newCharges);
  };

  const handleSaveShippingSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const settingsData = {
        courierPriority,
        codEnabled,
        customShippingCharges: shippingCharges,
      };

      // Saving shipping settings

      // Here you would make the actual API call
      // await updateMerchantShippingSettings(merchantId, settingsData);

      alert("Shipping settings saved successfully!");
    } catch (error) {
      console.error("Error saving shipping settings:", error);
      alert("Error saving shipping settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Disputes & Risk Handlers
  const handleDisputeAction = (dispute, actionType) => {
    setSelectedDispute(dispute);
    setModalType(actionType);
    setModalAmount("");
    setDisputesModalOpen(true);
  };

  const handleModalClose = () => {
    setDisputesModalOpen(false);
    setSelectedDispute(null);
    setModalType("");
    setModalAmount("");
  };

  const handleModalSubmit = async () => {
    if (!modalAmount || modalAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const actionData = {
        disputeId: selectedDispute.id,
        actionType: modalType,
        amount: parseFloat(modalAmount),
        orderId: selectedDispute.orderId,
      };

      // Applying action for dispute

      // Here you would make the actual API call
      // await applyDisputeAction(merchantId, actionData);

      alert(
        `${
          modalType === "penalty" ? "Penalty" : "Refund"
        } applied successfully!`
      );
      handleModalClose();
    } catch (error) {
      console.error(`Error applying ${modalType}:`, error);
      alert(`Error applying ${modalType}. Please try again.`);
    }
  };

  const handleSaveInternalNotes = async () => {
    setIsSavingNotes(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Saving internal notes

      // Here you would make the actual API call
      // await saveInternalNotes(merchantId, internalNotes);

      alert("Internal notes saved successfully!");
    } catch (error) {
      console.error("Error saving internal notes:", error);
      alert("Error saving internal notes. Please try again.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleAddNewNote = async () => {
    if (!newNote.trim()) {
      alert("Please enter a note before saving.");
      return;
    }

    setIsAddingNote(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const noteData = {
        content: newNote.trim(),
        admin: "Current Admin", // In real app, this would come from auth context
        timestamp: new Date().toLocaleString("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date().toISOString().split("T")[0],
      };

      // Adding new note

      // Here you would make the actual API call
      // await addMerchantNote(merchantId, noteData);

      // Add to local state (in real app, this would come from API response)
      merchantDetails.notesHistory.unshift({
        id: `NOTE${Date.now()}`,
        ...noteData,
      });

      setNewNote("");
      alert("Note added successfully!");
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Error adding note. Please try again.");
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleIntegrationChange = (integration, field, value) => {
    setFormData((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [integration]: {
          ...prev.integrations[integration],
          [field]: value,
        },
      },
    }));
  };

  const toggleApiKeyVisibility = (integration) => {
    setFormData((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [integration]: {
          ...prev.integrations[integration],
          showApiKey: !prev.integrations[integration].showApiKey,
        },
      },
    }));
  };

  const testConnection = async (integration) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Testing connection

      // Update last tested timestamp
      setFormData((prev) => ({
        ...prev,
        integrations: {
          ...prev.integrations,
          [integration]: {
            ...prev.integrations[integration],
            lastTested: new Date().toLocaleString("en-IN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        },
      }));

      alert(`${integration} connection test successful!`);
    } catch (error) {
      console.error(`Error testing ${integration} connection:`, error);
      alert(`Error testing ${integration} connection. Please try again.`);
    }
  };

  const handleCellClick = (rowIndex, field) => {
    // Don't allow editing COURIER and TYPE fields
    if (field === "courier" || field === "type") {
      return;
    }
    setEditingCell(`${rowIndex}-${field}`);
  };

  const handleCellChange = (rowIndex, field, value) => {
    const newData = [...data];
    // Remove ₹ and % symbols before saving
    let cleanValue = value.replace(/₹/g, "").replace(/%/g, "").trim();

    // For numeric fields, try to convert to number if possible
    const numericFields = [
      "withinCity",
      "withinState",
      "regional",
      "metroToMetro",
      "neJkKlAn",
      "restOfIndia",
      "codCharges",
    ];

    if (numericFields.includes(field)) {
      // If it's "-" or empty, keep it as "-"
      if (cleanValue === "-" || cleanValue === "") {
        cleanValue = "-";
      } else {
        // Try to convert to number
        const numValue = parseFloat(cleanValue);
        cleanValue = isNaN(numValue) ? cleanValue : numValue;
      }
    }

    // For codPercent, store as string without % (will be formatted on blur)
    if (field === "codPercent") {
      cleanValue = cleanValue === "" ? "" : cleanValue;
    }

    newData[rowIndex] = {
      ...newData[rowIndex],
      [field]: cleanValue,
    };
    setData(newData);
  };

  const handleCellFocus = (rowIndex, field) => {
    setFocusedCell(`${rowIndex}-${field}`);
  };

  const handleCellBlur = (rowIndex, field) => {
    // Format codPercent on blur - add % if value exists, otherwise set to "-"
    if (field === "codPercent") {
      const newData = [...data];
      const currentValue = newData[rowIndex][field];

      // Remove any existing % symbol
      let cleanValue = String(currentValue).replace(/%/g, "").trim();

      if (cleanValue === "" || cleanValue === "-") {
        newData[rowIndex][field] = "-";
      } else {
        // Keep as string with % for display
        newData[rowIndex][field] = `${cleanValue}%`;
      }
      setData(newData);
    }
    setFocusedCell(null);
    setEditingCell(null);
  };

  const handleKeyPress = (e, rowIndex, field) => {
    if (e.key === "Enter") {
      handleCellBlur(rowIndex, field);
    }
  };

  // Get all row indices for a given courier name
  const getCourierRowIndices = (courierName) => {
    return data
      .map((item, index) => (item.courier === courierName ? index : null))
      .filter((index) => index !== null);
  };

  // Check if this is the first row for a courier (where checkbox should appear)
  const isFirstRowForCourier = (rowIndex) => {
    const courierName = data[rowIndex].courier;
    // Checkbox should only appear on rows where courier name is not "-"
    if (courierName === "-") {
      return false;
    }
    const courierIndices = getCourierRowIndices(courierName);
    return courierIndices[0] === rowIndex;
  };

  // Check if all rows for a courier are selected
  const areAllCourierRowsSelected = (courierName) => {
    const courierIndices = getCourierRowIndices(courierName);
    return courierIndices.every((index) => selectedRows.has(index));
  };

  const handleCheckboxChange = (rowIndex) => {
    const courierName = data[rowIndex].courier;
    const courierIndices = getCourierRowIndices(courierName);
    const newSelectedRows = new Set(selectedRows);

    // Check if all rows for this courier are currently selected
    const allSelected = courierIndices.every((index) =>
      newSelectedRows.has(index)
    );

    if (allSelected) {
      // Deselect all rows for this courier
      courierIndices.forEach((index) => newSelectedRows.delete(index));
    } else {
      // Select all rows for this courier
      courierIndices.forEach((index) => newSelectedRows.add(index));
    }

    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === data.length && data.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((_, index) => index)));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourier(null);
    setSelectedWeight(null);
  };

  const handleAddCourier = () => {
    if (!selectedCourier || !selectedWeight) {
      alert("Please select both courier and weight");
      return;
    }

    const courierName = `${selectedCourier.value} ${selectedWeight.value}`;
    
    // Create 3 rows for the new courier
    const newRows = [
      {
        courier: courierName,
        weight: selectedWeight.value,
        type: "FWD",
        withinCity: 0,
        withinState: 0,
        regional: 0,
        metroToMetro: 0,
        neJkKlAn: 0,
        restOfIndia: 0,
        codCharges: "",
        codPercent: "",
      },
      {
        courier: "-",
        weight: selectedWeight.value,
        type: "RTO",
        withinCity: 0,
        withinState: 0,
        regional: 0,
        metroToMetro: 0,
        neJkKlAn: 0,
        restOfIndia: 0,
        codCharges: 0,
        codPercent: 0,
      },
      {
        courier: "-",
        weight: selectedWeight.value,
        type: "Add Wt",
        withinCity: 0,
        withinState: 0,
        regional: 0,
        metroToMetro: 0,
        neJkKlAn: 0,
        restOfIndia: 0,
        codCharges: "",
        codPercent: "",
      },
    ];

    setData([...data, ...newRows]);
    handleCloseModal();
  };

  const renderEditableCell = (rowIndex, field, value) => {
    const cellKey = `${rowIndex}-${field}`;
    const isEditing = editingCell === cellKey;

    // Price fields that need ₹ prefix
    const priceFields = [
      "withinCity",
      "withinState",
      "regional",
      "metroToMetro",
      "neJkKlAn",
      "restOfIndia",
      "codCharges",
    ];

    if (isEditing) {
      // Get raw value for input (without symbols)
      let inputValue =
        typeof value === "number"
          ? value.toString()
          : value === "-"
          ? ""
          : value;

      // Remove existing symbols if any
      inputValue = inputValue.replace(/₹/g, "").replace(/%/g, "").trim();

      if (priceFields.includes(field)) {
        // Price fields with ₹ prefix
        return (
          <div className="inline_edit_wrapper">
            <span className="inline_edit_prefix">₹</span>
            <input
              type="text"
              className="inline_edit_input"
              value={inputValue}
              onChange={(e) =>
                handleCellChange(rowIndex, field, e.target.value)
              }
              onBlur={() => handleCellBlur(rowIndex, field)}
              onKeyPress={(e) => handleKeyPress(e, rowIndex, field)}
              autoFocus
            />
          </div>
        );
      } else if (field === "codPercent") {
        // COD % field - hide % suffix when focused
        const cellKey = `${rowIndex}-${field}`;
        const isFocused = focusedCell === cellKey;
        const hasValue = inputValue !== "" && inputValue !== "-";
        return (
          <div className="inline_edit_wrapper">
            <input
              type="text"
              className={`inline_edit_input ${hasValue ? "with_suffix" : ""}`}
              value={inputValue}
              onChange={(e) =>
                handleCellChange(rowIndex, field, e.target.value)
              }
              onFocus={() => handleCellFocus(rowIndex, field)}
              onBlur={() => handleCellBlur(rowIndex, field)}
              onKeyPress={(e) => handleKeyPress(e, rowIndex, field)}
              autoFocus
            />
            {hasValue && !isFocused && (
              <span className="inline_edit_suffix">%</span>
            )}
          </div>
        );
      } else {
        // Other fields
        return (
          <input
            type="text"
            className="inline_edit_input"
            value={inputValue}
            onChange={(e) => handleCellChange(rowIndex, field, e.target.value)}
            onBlur={() => handleCellBlur(rowIndex, field)}
            onKeyPress={(e) => handleKeyPress(e, rowIndex, field)}
            autoFocus
          />
        );
      }
    }

    // For display, format the value
    const displayValue =
      field === "codCharges" && value === "-"
        ? "-"
        : field === "codCharges" && value !== "-"
        ? `₹${value}`
        : field === "codPercent" && value === "-"
        ? "-"
        : field === "codPercent"
        ? `${String(value).replace(/%/g, "")}%`
        : typeof value === "number"
        ? `₹${value}`
        : value;

    return (
      <span
        className="editable_cell"
        onClick={() => handleCellClick(rowIndex, field)}
      >
        {displayValue}
      </span>
    );
  };

  return (
    <div className="shipment_section merchant_view_details">
      {/* Header Section */}
      <div className="merchant_header">
        <div className="header_left">
          <RippleButton
            className="back_button"
            onClick={() => navigate("/super-admin/merchants")}
          >
            <ArrowLeft size={20} />
            Back to Merchants
          </RippleButton>
          <div className="merchant_info">
            <div className="merchant_name_section">
              <h1>{merchantDetails.businessName}</h1>
              <span
                className="tier_badge"
                style={{
                  backgroundColor: `${
                    getTierBadgeColor(merchantDetails.tier).bg
                  }20`,
                  color: getTierBadgeColor(merchantDetails.tier).color,
                }}
              >
                {merchantDetails.tier}
              </span>
            </div>
            <p className="merchant_id">
              Merchant ID: {merchantId || merchantDetails.id}
            </p>
          </div>
        </div>
        <div className="header_right">
          <div className="status_section">
            <span className="status_label">Status:</span>
            <div className="status_toggle">
              <span
                className="status_badge"
                style={{
                  backgroundColor: `${
                    getStatusAccountColor(merchantStatus).bg
                  }20`,
                  color: getStatusAccountColor(merchantStatus).color,
                }}
              >
                {merchantStatus}
              </span>
              <div className="toggle_switch">
                <input
                  type="checkbox"
                  checked={merchantStatus === "Active"}
                  onChange={handleStatusToggle}
                  className="toggle_input"
                />
                <span className="toggle_slider"></span>
              </div>
            </div>
          </div>
          <div className="action_buttons">
            <RippleButton className="action_btn suspend_btn">
              <UserX size={16} />
              Suspend
            </RippleButton>
            <RippleButton className="action_btn reset_btn">
              <Key size={16} />
              Reset Password
            </RippleButton>
            <RippleButton className="action_btn impersonate_btn">
              <UserCheck size={16} />
              Impersonate
            </RippleButton>
            <RippleButton className="action_btn notify_btn">
              <Bell size={16} />
              Notify
            </RippleButton>
          </div>
        </div>
      </div>
      <div className="tab_navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab_button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab_content">
        {activeTab === "overview" && (
          <div className="overview_content">
            {/* Metrics Cards */}
            <div className="metrics_cards">
              <div className="metric_card">
                <div className="metric_header">
                  <Package size={20} className="metric_icon" />
                  <span className="metric_title">Total Orders</span>
                </div>
                <div className="metric_value">
                  {merchantDetails.totalOrders.toLocaleString()}
                </div>
                <div className="metric_change positive">
                  <TrendingUp size={14} />
                  +12% from last month
                </div>
              </div>

              <div className="metric_card">
                <div className="metric_header">
                  <Truck size={20} className="metric_icon" />
                  <span className="metric_title">Delivered Orders</span>
                </div>
                <div className="metric_value">
                  {merchantDetails.deliveredOrders.toLocaleString()}
                </div>
                <div className="metric_change positive">
                  <TrendingUp size={14} />
                  +8% from last month
                </div>
              </div>

              <div className="metric_card">
                <div className="metric_header">
                  <AlertTriangle size={20} className="metric_icon" />
                  <span className="metric_title">RTO Orders</span>
                </div>
                <div className="metric_value">
                  {merchantDetails.rtoOrders} (
                  {(
                    (merchantDetails.rtoOrders / merchantDetails.totalOrders) *
                    100
                  ).toFixed(1)}
                  %)
                </div>
                <div className="metric_change negative">
                  <TrendingDown size={14} />
                  -3% from last month
                </div>
              </div>

              <div className="metric_card">
                <div className="metric_header">
                  <IndianRupee size={20} className="metric_icon" />
                  <span className="metric_title">Pending COD</span>
                </div>
                <div className="metric_value">
                  {formatCurrency(merchantDetails.pendingCod)}
                </div>
                <div className="metric_change positive">
                  <TrendingUp size={14} />
                  +15% from last month
                </div>
              </div>

              <div className="metric_card">
                <div className="metric_header">
                  <BarChart3 size={20} className="metric_icon" />
                  <span className="metric_title">Lifetime Shipping</span>
                </div>
                <div className="metric_value">
                  {formatCurrency(merchantDetails.lifetimeShipping)}
                </div>
                <div className="metric_change neutral">
                  <Calendar size={14} />
                  All time
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts_section">
              <div className="chart_card">
                <div className="chart_header">
                  <h3>Orders Trend (Last 30 Days)</h3>
                </div>
                <div className="chart_placeholder">
                  <BarChart3 size={48} className="chart_icon" />
                  <p>Chart visualization would be implemented here</p>
                  <span>Daily orders trend for the last 30 days</span>
                </div>
              </div>

              <div className="chart_card">
                <div className="chart_header">
                  <h3>COD Payouts Trend</h3>
                </div>
                <div className="chart_placeholder">
                  <IndianRupee size={48} className="chart_icon" />
                  <p>Chart visualization would be implemented here</p>
                  <span>COD payout amounts over time</span>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="recent_orders_section">
              <div className="section_header">
                <h3>Recent Orders</h3>
              </div>
              <div className="table_container">
                <table className="orders_table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Courier</th>
                      <th>Status</th>
                      <th>Declared Weight</th>
                      <th>Charged Weight</th>
                      <th>COD Amount</th>
                      <th>Extra Charges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.orderId}>
                        <td className="order_id">{order.orderId}</td>
                        <td className="order_date">{formatDate(order.date)}</td>
                        <td className="courier">{order.courier}</td>
                        <td>
                          <span
                            className="status_badge"
                            style={{
                              backgroundColor: `${
                                getStatusBadgeColor(order.status).bg
                              }20`,
                              color: getStatusBadgeColor(order.status).color,
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="declared_weight">
                          {order.declaredWeight}
                        </td>
                        <td className="charged_weight">
                          {order.chargedWeight}
                          {order.weightDiscrepancy && (
                            <AlertTriangle size={14} className="warning_icon" />
                          )}
                        </td>
                        <td className="cod_amount">
                          {formatCurrency(order.codAmount)}
                        </td>
                        <td className="extra_charges">
                          {order.extraCharges
                            ? formatCurrency(order.extraCharges)
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="billing_content">
            {/* Bank Details Section */}
            <div className="billing_section">
              <div className="section_header">
                <h3>Bank Details</h3>
              </div>
              <div className="bank_details_card">
                <div className="bank_info">
                  <div className="bank_field">
                    <label>Account Number</label>
                    <span className="bank_value">
                      {merchantDetails.bankDetails.accountNumber}
                    </span>
                  </div>
                  <div className="bank_field">
                    <label>IFSC Code</label>
                    <span className="bank_value">
                      {merchantDetails.bankDetails.ifscCode}
                    </span>
                  </div>
                  <div className="bank_field">
                    <label>UPI ID</label>
                    <span className="bank_value">
                      {merchantDetails.bankDetails.upiId}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Rules and Payout Cycle Configuration */}
            <div className="billing_row">
              <div className="billing_section tax_rules_section">
                <div className="section_header">
                  <div className="section_title">
                    <span className="section_icon">%</span>
                    <h3>Tax Rules Configuration</h3>
                  </div>
                </div>
                <div className="tax_rules_card">
                  <div className="tax_rules_content">
                    <div className="tax_field">
                      <label>GST Rate (%)</label>
                      <input
                        type="number"
                        className="tax_input"
                        value="18"
                        placeholder="Enter GST rate"
                      />
                      <span className="field_description">
                        Current GST rate applied to all transactions
                      </span>
                    </div>
                    <div className="tax_field">
                      <label>Tax Calculation Method</label>
                      <div className="tax_select_wrapper">
                        <Select
                          value={{ value: "inclusive", label: "Inclusive" }}
                          options={[
                            { value: "inclusive", label: "Inclusive" },
                            { value: "exclusive", label: "Exclusive" },
                          ]}
                          className="option_select"
                          isSearchable={false}
                          placeholder="Select method"
                        />
                      </div>
                    </div>
                    <div className="tax_field">
                      <div className="toggle_field">
                        <label className="toggle_label">
                          Automatically calculate GST on all payouts
                        </label>
                        <div className="toggle_switch">
                          <input
                            type="checkbox"
                            id="gst-toggle"
                            className="toggle_input"
                          />
                          <label
                            htmlFor="gst-toggle"
                            className="toggle_slider"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="billing_section payout_cycle_section">
                <div className="section_header">
                  <div className="section_title">
                    <span className="section_icon">📅</span>
                    <h3>Payout Cycle Configuration</h3>
                  </div>
                </div>
                <div className="payout_cycle_card">
                  <div className="payout_cycle_content">
                    <div className="payout_field">
                      <label>Weekly Payout Day</label>
                      <div className="payout_select_wrapper">
                        <Select
                          value={{ value: "tuesday", label: "Tuesday" }}
                          options={[
                            { value: "monday", label: "Monday" },
                            { value: "tuesday", label: "Tuesday" },
                            { value: "wednesday", label: "Wednesday" },
                            { value: "thursday", label: "Thursday" },
                            { value: "friday", label: "Friday" },
                          ]}
                          className="option_select"
                          isSearchable={false}
                          placeholder="Select day"
                        />
                      </div>
                    </div>

                    <div className="payout_field">
                      <label>Twice Monthly Dates</label>
                      <div className="date_inputs_wrapper">
                        <input
                          type="number"
                          className="date_input"
                          value="1"
                          min="1"
                          max="31"
                          placeholder="1st"
                        />
                        <input
                          type="number"
                          className="date_input"
                          value="16"
                          min="1"
                          max="31"
                          placeholder="16th"
                        />
                      </div>
                    </div>

                    <div className="payout_field">
                      <label>Monthly Payout Date</label>
                      <input
                        type="number"
                        className="date_input"
                        value="1"
                        min="1"
                        max="31"
                        placeholder="Enter date"
                      />
                    </div>

                    <div className="payout_field">
                      <div className="toggle_field">
                        <label className="toggle_label">
                          Enable D+5 eligibility logic
                        </label>
                        <div className="toggle_switch">
                          <input
                            type="checkbox"
                            id="d5-toggle"
                            className="toggle_input"
                            defaultChecked
                          />
                          <label
                            htmlFor="d5-toggle"
                            className="toggle_slider"
                          ></label>
                        </div>
                      </div>
                    </div>

                    <div className="payout_field">
                      <label>Eligibility Days After Delivery</label>
                      <input
                        type="number"
                        className="date_input"
                        value="5"
                        min="1"
                        max="30"
                        placeholder="Enter days"
                      />
                      <span className="field_description">
                        Number of days after delivery before payout eligibility
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Adjustments History */}
            <div className="billing_section">
              <div className="section_header">
                <h3>Adjustments History</h3>
                <RippleButton className="add_adjustment_btn">
                  <Plus size={16} />
                  Add Adjustment
                </RippleButton>
              </div>
              <div className="adjustments_card">
                <div className="adjustments_table">
                  <div className="adjustment_header">
                    <span>Type</span>
                    <span>Description</span>
                    <span>Date</span>
                    <span>Amount</span>
                  </div>
                  {merchantDetails.adjustments.map((adjustment) => (
                    <div key={adjustment.id} className="adjustment_row">
                      <span
                        className={`adjustment_type ${adjustment.type.toLowerCase()}`}
                      >
                        {adjustment.type}
                      </span>
                      <span className="adjustment_description">
                        {adjustment.description}
                      </span>
                      <span className="adjustment_date">
                        {formatDate(adjustment.date)}
                      </span>
                      <span
                        className={`adjustment_amount ${adjustment.type.toLowerCase()}`}
                      >
                        {adjustment.type === "Credit" ? "+" : "-"}
                        {formatCurrency(adjustment.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* GST Invoices */}
            <div className="billing_section">
              <div className="section_header">
                <h3>GST Invoices</h3>
              </div>
              <div className="gst_invoices_card">
                <div className="invoices_list">
                  {merchantDetails.gstInvoices.map((invoice) => (
                    <div key={invoice.id} className="invoice_item">
                      <div className="invoice_info">
                        <div className="invoice_header">
                          <span className="invoice_number">{invoice.id}</span>
                          <span className="invoice_month">{invoice.month}</span>
                        </div>
                        <div className="invoice_details">
                          <span className="invoice_amount">
                            {formatCurrency(invoice.amount)}
                          </span>
                          <span
                            className={`invoice_status ${invoice.status.toLowerCase()}`}
                          >
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                      <RippleButton className="download_invoice_btn">
                        <Download size={16} />
                        Download
                      </RippleButton>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "rateCard" && (
          <div className="price_calculator_section">
            <div className="pricing_plans_section">
              <div className="section_header">
                <h2>Rate Card</h2>
                <RippleButton
                  className="add_courier_btn"
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Courier
                </RippleButton>
              </div>

          <div className="pricing_table_container">
            <table className="pricing_table">
              <thead>
                <tr>
                  <th>
                    <RippleButton
                      className="checkbox_wrapper"
                      onClick={handleSelectAll}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={
                          selectedRows.size === data.length && data.length > 0
                        }
                        readOnly
                      />
                    </RippleButton>
                  </th>
                  <th>COURIER</th>
                  <th>WEIGHT</th>
                  <th>TYPE</th>
                  <th>WITHIN CITY</th>
                  <th>WITHIN STATE</th>
                  <th>REGIONAL</th>
                  <th>METRO TO METRO</th>
                  <th>NE, J&K, KL, AN</th>
                  <th>REST OF INDIA</th>
                  <th>COD CHARGES</th>
                  <th>COD %</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {isFirstRowForCourier(index) ? (
                        <RippleButton
                          className="checkbox_wrapper"
                          onClick={() => handleCheckboxChange(index)}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={areAllCourierRowsSelected(item.courier)}
                            readOnly
                          />
                        </RippleButton>
                      ) : (
                        <span></span>
                      )}
                    </td>
                    <td>{item.courier === "-" ? "" : item.courier}</td>
                    <td>{item?.weight}</td>
                    <td>
                      <span
                        className={`type_badge ${item.type
                          .toLowerCase()
                          .replace(" ", "_")}`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td>
                      {renderEditableCell(index, "withinCity", item.withinCity)}
                    </td>
                    <td>
                      {renderEditableCell(
                        index,
                        "withinState",
                        item.withinState
                      )}
                    </td>
                    <td>
                      {renderEditableCell(index, "regional", item.regional)}
                    </td>
                    <td>
                      {renderEditableCell(
                        index,
                        "metroToMetro",
                        item.metroToMetro
                      )}
                    </td>
                    <td>
                      {renderEditableCell(index, "neJkKlAn", item.neJkKlAn)}
                    </td>
                    <td>
                      {renderEditableCell(
                        index,
                        "restOfIndia",
                        item.restOfIndia
                      )}
                    </td>
                    <td>
                      {item.type === "RTO" && (
                        renderEditableCell(index, "codCharges", item.codCharges)
                      )}
                    </td>
                    <td>
                      {item.type === "RTO" && (
                        renderEditableCell(index, "codPercent", item.codPercent)
                      )}
                    </td>
                  </tr>
                ))}
                </tbody>
            </table>
          </div>
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="shipping_content">
            {/* Courier Priority Control */}
            <div className="shipping_section">
              <div className="section_header">
                <h3>Courier Priority Control</h3>
                <p className="section_description">
                  Drag to reorder courier priority. Higher priority couriers
                  will be selected first for new bookings.
                </p>
              </div>
              <div className="courier_list">
                {isLoadingCouriers ? (
                  <div className="loading_message">Loading couriers...</div>
                ) : courierPriority.length === 0 ? (
                  <div className="empty_message">No couriers found</div>
                ) : (
                  courierPriority.map((courier, index) => (
                    <div key={courier.id} className="courier_item">
                      <div className="courier_drag_handle">
                        <GripVertical size={16} />
                      </div>
                      <div className="courier_info">
                        <span className="courier_priority">
                          #{courier.priority}
                        </span>
                        <span className="courier_name">{courier.name}</span>
                      </div>
                      <div className="courier_controls">
                        <button
                          className="priority_btn"
                          onClick={() =>
                            handleCourierPriorityChange(index, "up")
                          }
                          disabled={index === 0}
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          className="priority_btn"
                          onClick={() =>
                            handleCourierPriorityChange(index, "down")
                          }
                          disabled={index === courierPriority.length - 1}
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COD Settings */}
            <div className="shipping_section">
              <div className="section_header">
                <h3>COD Settings</h3>
                <p className="section_description">
                  Allow cash on delivery for this merchant
                </p>
              </div>
              <div className="cod_settings_card">
                <div className="cod_toggle_section">
                  <div className="cod_info">
                    <h4>Enable COD</h4>
                    <p>Allow cash on delivery for this merchant</p>
                  </div>
                  <div className="cod_toggle">
                    <input
                      type="checkbox"
                      checked={codEnabled}
                      onChange={handleCodToggle}
                      className="toggle_input"
                    />
                    <span className="toggle_slider"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Shipping Charges */}
            <div className="shipping_section">
              <div className="section_header">
                <h3>Custom Shipping Charges</h3>
                <p className="section_description">
                  Custom charges override global FShip rates. Leave empty to use
                  default rates.
                </p>
              </div>
              <div className="shipping_charges_card">
                <div className="charges_table">
                  <div className="charges_header">
                    <span>Zone</span>
                    <span>0-500g (₹)</span>
                    <span>500g-1kg (₹)</span>
                    <span>1-2kg (₹)</span>
                    <span>COD Surcharge (₹)</span>
                  </div>
                  {shippingCharges.map((charge, index) => (
                    <div key={index} className="charges_row">
                      <div className="zone_cell">
                        <span className="zone_name">{charge.zone}</span>
                      </div>
                      <div className="charge_input_cell">
                        <input
                          type="number"
                          value={charge.weight0to500}
                          onChange={(e) =>
                            handleShippingChargeChange(
                              index,
                              "weight0to500",
                              e.target.value
                            )
                          }
                          className="charge_input"
                          min="0"
                        />
                      </div>
                      <div className="charge_input_cell">
                        <input
                          type="number"
                          value={charge.weight500to1kg}
                          onChange={(e) =>
                            handleShippingChargeChange(
                              index,
                              "weight500to1kg",
                              e.target.value
                            )
                          }
                          className="charge_input"
                          min="0"
                        />
                      </div>
                      <div className="charge_input_cell">
                        <input
                          type="number"
                          value={charge.weight1to2kg}
                          onChange={(e) =>
                            handleShippingChargeChange(
                              index,
                              "weight1to2kg",
                              e.target.value
                            )
                          }
                          className="charge_input"
                          min="0"
                        />
                      </div>
                      <div className="charge_input_cell">
                        <input
                          type="number"
                          value={charge.codSurcharge}
                          onChange={(e) =>
                            handleShippingChargeChange(
                              index,
                              "codSurcharge",
                              e.target.value
                            )
                          }
                          className="charge_input"
                          min="0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Settings Button */}
            <div className="shipping_actions">
              <RippleButton
                className="save_settings_btn"
                onClick={handleSaveShippingSettings}
                disabled={isSaving}
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Settings"}
              </RippleButton>
            </div>
          </div>
        )}

        {activeTab === "disputes" && (
          <div className="disputes_content">
            {/* Risk Assessment Section */}
            <div className="risk_assessment_section">
              <div className="section_header">
                <h3>▲ Risk Assessment</h3>
              </div>
              <div className="risk_assessment_card">
                <div className="risk_score_section">
                  <div className="risk_score">
                    <span className="score_value">
                      {merchantDetails.riskAssessment.score}
                    </span>
                    <span className="score_max">
                      /{merchantDetails.riskAssessment.maxScore}
                    </span>
                  </div>
                  <div className="risk_progress">
                    <div className="progress_bar">
                      <div
                        className="progress_fill"
                        style={{
                          width: `${
                            (merchantDetails.riskAssessment.score /
                              merchantDetails.riskAssessment.maxScore) *
                            100
                          }%`,
                          backgroundColor:
                            merchantDetails.riskAssessment.score <= 3
                              ? "#10B981"
                              : merchantDetails.riskAssessment.score <= 7
                              ? "#F59E0B"
                              : "#EF4444",
                        }}
                      ></div>
                    </div>
                    <span className="risk_level">
                      {merchantDetails.riskAssessment.level}
                    </span>
                  </div>
                </div>
                <div className="risk_metrics">
                  <div className="risk_metric">
                    <span className="metric_label">RTO Percentage:</span>
                    <span className="metric_value">
                      {merchantDetails.riskAssessment.rtoPercentage}%
                    </span>
                  </div>
                  <div className="risk_metric">
                    <span className="metric_label">Weight Discrepancies:</span>
                    <span className="metric_value">
                      {merchantDetails.riskAssessment.weightDiscrepancies}
                    </span>
                  </div>
                  <div className="risk_metric">
                    <span className="metric_label">Pending COD:</span>
                    <span className="metric_value">
                      {formatCurrency(
                        merchantDetails.riskAssessment.pendingCod
                      )}
                    </span>
                  </div>
                  <div className="risk_metric">
                    <span className="metric_label">Open Disputes:</span>
                    <span className="metric_value">
                      {merchantDetails.riskAssessment.openDisputes}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Disputes Management Section */}
            <div className="disputes_management_section">
              <div className="section_header">
                <h3>Disputes Management</h3>
              </div>
              <div className="disputes_table_card">
                <div className="disputes_table">
                  <div className="disputes_header">
                    <span>Dispute ID</span>
                    <span>Order ID</span>
                    <span>Type</span>
                    <span>Declared Weight</span>
                    <span>Charged Weight</span>
                    <span>Extra Charges</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>
                  {merchantDetails.disputes.map((dispute) => (
                    <div key={dispute.id} className="dispute_row">
                      <span className="dispute_id">{dispute.id}</span>
                      <span className="order_id">{dispute.orderId}</span>
                      <span className="dispute_type">{dispute.type}</span>
                      <span className="declared_weight">
                        {dispute.declaredWeight}
                      </span>
                      <span className="charged_weight">
                        {dispute.chargedWeight}
                        {dispute.status === "Open" && (
                          <AlertTriangle size={14} className="warning_icon" />
                        )}
                      </span>
                      <span className="extra_charges">
                        {dispute.extraCharges
                          ? formatCurrency(dispute.extraCharges)
                          : "-"}
                      </span>
                      <span
                        className={`dispute_status ${dispute.status.toLowerCase()}`}
                      >
                        {dispute.status}
                      </span>
                      <div className="dispute_actions">
                        {dispute.status === "Open" ? (
                          <>
                            <RippleButton
                              className="action_btn resolve_btn"
                              onClick={() => {}}
                            >
                              Resolve
                            </RippleButton>
                            <RippleButton
                              className="action_btn penalty_btn"
                              onClick={() =>
                                handleDisputeAction(dispute, "penalty")
                              }
                            >
                              Penalty
                            </RippleButton>
                            <RippleButton
                              className="action_btn refund_btn"
                              onClick={() =>
                                handleDisputeAction(dispute, "refund")
                              }
                            >
                              Refund
                            </RippleButton>
                          </>
                        ) : (
                          <span className="no_actions">-</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Internal Notes Section */}
            <div className="internal_notes_section">
              <div className="section_header">
                <h3>Internal Notes</h3>
              </div>
              <div className="internal_notes_card">
                <textarea
                  className="notes_textarea"
                  placeholder="Add internal notes for staff reference..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={6}
                />
                <div className="notes_actions">
                  <RippleButton
                    className="save_notes_btn"
                    onClick={handleSaveInternalNotes}
                    disabled={isSavingNotes}
                  >
                    <Save size={16} />
                    {isSavingNotes ? "Saving..." : "Save Notes"}
                  </RippleButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="notes_content">
            {/* Internal Notes Section */}
            <div className="internal_notes_section">
              <div className="section_header">
                <h3>
                  <FileText size={20} />
                  Internal Notes
                </h3>
              </div>
              <div className="internal_notes_card">
                <textarea
                  className="notes_textarea"
                  placeholder="Add a new internal note for this merchant..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={4}
                />
                <div className="notes_actions">
                  <RippleButton
                    className="save_note_btn"
                    onClick={handleAddNewNote}
                    disabled={isAddingNote}
                  >
                    <Save size={16} />
                    {isAddingNote ? "Adding..." : "Save Note"}
                  </RippleButton>
                </div>
              </div>
            </div>

            {/* Notes History Section */}
            <div className="notes_history_section">
              <div className="section_header">
                <h3>Notes History</h3>
              </div>
              <div className="notes_history_card">
                <div className="notes_list">
                  {merchantDetails.notesHistory.map((note) => (
                    <div key={note.id} className="note_item">
                      <div className="note_content">
                        <p className="note_text">{note.content}</p>
                        <div className="note_meta">
                          <span className="note_admin">By {note.admin}</span>
                          <span className="note_timestamp">
                            {note.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audit Log Section */}
            <div className="audit_log_section">
              <div className="section_header">
                <h3>
                  <Clock size={20} />
                  Audit Log
                </h3>
              </div>
              <div className="audit_log_card">
                <div className="audit_table">
                  <div className="audit_header">
                    <span>Date/Time</span>
                    <span>Staff</span>
                    <span>Action</span>
                    <span>Old Value</span>
                    <span>New Value</span>
                  </div>
                  {merchantDetails.auditLog.map((log) => (
                    <div key={log.id} className="audit_row">
                      <span className="audit_datetime">{log.dateTime}</span>
                      <span className="audit_staff">{log.staff}</span>
                      <span className={`audit_action ${log.actionType}`}>
                        {log.action}
                      </span>
                      <span className="audit_old_value">{log.oldValue}</span>
                      <span className="audit_new_value">{log.newValue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "integration" && (
          <div className="integration_content">
            <div className="integration_card">
              <div className="integration_header">
                <div className="integration_info">
                  <div className="integration_icon shopify">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15.337 23.979c-.175 0-.319-.143-.319-.319V.319c0-.175.144-.319.319-.319h.319c.175 0 .319.144.319.319v23.341c0 .176-.144.319-.319.319h-.319z"
                        fill="white"
                      />
                      <path
                        d="M8.319 23.979c-.175 0-.319-.143-.319-.319V.319c0-.175.144-.319.319-.319h.319c.175 0 .319.144.319.319v23.341c0 .176-.144.319-.319.319h-.319z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="integration_title">
                    <h6>Shopify</h6>
                    <p>Shopify Integration</p>
                  </div>
                </div>
                <div
                  className={`status_badge ${formData.integrations.shopify.status}`}
                >
                  <span>{formData.integrations.shopify.status}</span>
                </div>
              </div>

              <div className="integration_fields">
                <div className="input_main">
                  <label>API Key</label>
                  <div className="password_input_wrapper">
                    <input
                      type={
                        formData.integrations.shopify.showApiKey
                          ? "text"
                          : "password"
                      }
                      value={formData.integrations.shopify.apiKey}
                      onChange={(e) =>
                        handleIntegrationChange(
                          "shopify",
                          "apiKey",
                          e.target.value
                        )
                      }
                      placeholder="Enter API key"
                    />
                    <span
                      className="toggle_password"
                      onClick={() => toggleApiKeyVisibility("shopify")}
                    >
                      {formData.integrations.shopify.showApiKey ? "👁️" : "👁️‍🗨️"}
                    </span>
                  </div>
                </div>

                <div className="input_main">
                  <label>API Secret</label>
                  <input
                    type="password"
                    value={formData.integrations.shopify.apiSecret}
                    onChange={(e) =>
                      handleIntegrationChange(
                        "shopify",
                        "apiSecret",
                        e.target.value
                      )
                    }
                    placeholder="Enter API secret"
                  />
                </div>

                <div className="input_main">
                  <label>Webhook URL</label>
                  <input
                    type="url"
                    value={formData.integrations.shopify.webhookUrl}
                    onChange={(e) =>
                      handleIntegrationChange(
                        "shopify",
                        "webhookUrl",
                        e.target.value
                      )
                    }
                    placeholder="https://api.example.com/webhooks/shopify"
                  />
                </div>
              </div>

              <div className="integration_footer">
                <span className="last_tested">
                  Last tested: {formData.integrations.shopify.lastTested}
                </span>
                <div className="integration_actions">
                  <button
                    type="button"
                    className="test_btn"
                    onClick={() => testConnection("shopify")}
                  >
                    Test Connection
                  </button>
                  <button type="submit" className="save_btn">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disputes Modal */}
      {disputesModalOpen && (
        <div className="modal_overlay">
          <div className="disputes_modal">
            <div className="modal_header">
              <h3>Apply {modalType === "penalty" ? "Penalty" : "Refund"}</h3>
              <button className="modal_close_btn" onClick={handleModalClose}>
                ×
              </button>
            </div>
            <div className="modal_body">
              <p className="modal_description">
                Apply a{" "}
                {modalType === "penalty" ? "penalty charge" : "refund credit"}{" "}
                for dispute {selectedDispute?.id}.
              </p>
              <div className="modal_input_section">
                <label className="modal_label">
                  {modalType === "penalty" ? "Penalty" : "Refund"} Amount (₹)
                </label>
                <input
                  type="number"
                  className="modal_input"
                  placeholder={`Enter ${
                    modalType === "penalty" ? "penalty" : "refund"
                  } amount`}
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="modal_footer">
              <RippleButton
                className="modal_cancel_btn"
                onClick={handleModalClose}
              >
                Cancel
              </RippleButton>
              <RippleButton
                className="modal_submit_btn"
                onClick={handleModalSubmit}
              >
                Apply {modalType === "penalty" ? "Penalty" : "Refund"}
              </RippleButton>
            </div>
          </div>
        </div>
      )}

      {/* Add Courier Modal */}
      {isModalOpen && (
        <div className="custom_modal_overlay" onClick={handleCloseModal}>
          <div className="custom_modal_content" onClick={(e) => e.stopPropagation()}>
            <div className="modal_header">
              <h3>Add New Courier</h3>
              <button
                className="modal_close_btn"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <div className="modal_body">
              <div className="form_group">
                <label>Courier Name:</label>
                <Select
                  options={courierOptions}
                  value={selectedCourier}
                  onChange={(selectedOption) => setSelectedCourier(selectedOption)}
                  placeholder="Select Courier"
                  className="option_select"
                  isClearable
                />
              </div>
              <div className="form_group">
                <label>Weight:</label>
                <Select
                  options={weightOptions}
                  value={selectedWeight}
                  onChange={(selectedOption) => setSelectedWeight(selectedOption)}
                  placeholder="Select Weight"
                  className="option_select"
                  isClearable
                />
              </div>
            </div>
            <div className="modal_footer">
              <RippleButton
                className="btn_cancel"
                onClick={handleCloseModal}
              >
                Cancel
              </RippleButton>
              <RippleButton
                className="btn_submit"
                onClick={handleAddCourier}
              >
                Add Courier
              </RippleButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantViewDetails;
