import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Download,
  Upload,
  Plus,
  Eye,
  Edit,
  UserX,
  Key,
  UserCheck,
} from "lucide-react";
import RippleButton from "../components/RippleButton";
import CustomSelect from "../components/CustomSelect";
import Select from "react-select";

// Mock merchant data
const merchantData = [
  {
    id: "M001",
    businessName: "TechStore India",
    owner: "Rahul Sharma",
    gstin: "29ABCDE1234F1Z5",
    tier: "Premium",
    status: "Active",
    codCycle: "Weekly",
    pendingCod: 125000,
    lastActive: "2024-01-15",
    riskScore: 3,
    email: "rahul@techstore.com",
    phone: "+91 98765 43210",
  },
  {
    id: "M002",
    businessName: "Fashion Hub",
    owner: "Priya Patel",
    gstin: "24FGHIJ5678K2L6",
    tier: "Standard",
    status: "Active",
    codCycle: "Biweekly",
    pendingCod: 75000,
    lastActive: "2024-01-14",
    riskScore: 5,
    email: "priya@fashionhub.com",
    phone: "+91 98765 43211",
  },
  {
    id: "M003",
    businessName: "Home Essentials",
    owner: "Amit Kumar",
    gstin: "07MNOPQ9012R3S7",
    tier: "Starter",
    status: "Suspended",
    codCycle: "Monthly",
    pendingCod: 25000,
    lastActive: "2024-01-10",
    riskScore: 8,
    email: "amit@homeessentials.com",
    phone: "+91 98765 43212",
  },
  {
    id: "M004",
    businessName: "ElectroMart",
    owner: "Sneha Singh",
    gstin: "12QRSTU3456V7W8",
    tier: "Premium",
    status: "Active",
    codCycle: "Weekly",
    pendingCod: 200000,
    lastActive: "2024-01-16",
    riskScore: 2,
    email: "sneha@electromart.com",
    phone: "+91 98765 43213",
  },
  {
    id: "M005",
    businessName: "BookWorld",
    owner: "Vikram Joshi",
    gstin: "33XYZAB7890C1D2",
    tier: "Standard",
    status: "Pending",
    codCycle: "Monthly",
    pendingCod: 0,
    lastActive: "2024-01-12",
    riskScore: 6,
    email: "vikram@bookworld.com",
    phone: "+91 98765 43214",
  },
];

const tierOptions = [
  { value: "all", label: "All Tiers" },
  { value: "Premium", label: "Premium" },
  { value: "Standard", label: "Standard" },
  { value: "Starter", label: "Starter" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Suspended", label: "Suspended" },
  { value: "Pending", label: "Pending" },
];

const codCycleOptions = [
  { value: "all", label: "All Cycles" },
  { value: "Weekly", label: "Weekly" },
  { value: "Biweekly", label: "Biweekly" },
  { value: "Monthly", label: "Monthly" },
];

const SuperAdminMerchant = () => {
  const navigate = useNavigate();
  const [merchants] = useState(merchantData);
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCodCycle, setSelectedCodCycle] = useState(null);
  const [selectedMerchants, setSelectedMerchants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showActionDropdown, setShowActionDropdown] = useState(null);

  // Filter merchants based on filters
  const filteredMerchants = merchants.filter((merchant) => {
    const matchesTier =
      !selectedTier ||
      selectedTier.value === "all" ||
      merchant.tier === selectedTier.value;
    const matchesStatus =
      !selectedStatus ||
      selectedStatus.value === "all" ||
      merchant.status === selectedStatus.value;
    const matchesCodCycle =
      !selectedCodCycle ||
      selectedCodCycle.value === "all" ||
      merchant.codCycle === selectedCodCycle.value;

    return matchesTier && matchesStatus && matchesCodCycle;
  });

  // Pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedMerchants = filteredMerchants.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredMerchants.length / rowsPerPage);

  const isAllSelected =
    paginatedMerchants.length > 0 &&
    paginatedMerchants.every((merchant) =>
      selectedMerchants.includes(merchant.id)
    );

  const handleCheckboxChange = (id) => {
    setSelectedMerchants((prev) =>
      prev.includes(id)
        ? prev.filter((merchantId) => merchantId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      const unselected = selectedMerchants.filter(
        (id) => !paginatedMerchants.some((merchant) => merchant.id === id)
      );
      setSelectedMerchants(unselected);
    } else {
      const allIds = paginatedMerchants.map((merchant) => merchant.id);
      const combinedIds = Array.from(
        new Set([...selectedMerchants, ...allIds])
      );
      setSelectedMerchants(combinedIds);
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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Active":
        return { bg: "#10B981", color: "#10B981" };
      case "Suspended":
        return { bg: "#EF4444", color: "#EF4444" };
      case "Pending":
        return { bg: "#F59E0B", color: "#F59E0B" };
      default:
        return { bg: "#374151", color: "#374151" };
    }
  };

  const getRiskScoreColor = (score) => {
    if (score <= 3) return "#10B981";
    if (score <= 6) return "#F59E0B";
    return "#EF4444";
  };

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

  const handleActionClick = (merchantId, action) => {
    // Action clicked for merchant
    setShowActionDropdown(null);

    if (action === "view") {
      navigate(`/super-admin/merchants/${merchantId}`);
    }
    // Implement other action logic here
  };

  return (
    <div className="shipment_section super_admin_merchant">
      <div className="page_header">
        <h1>Merchants</h1>
      </div>
      <div className="filter_controls">
        <Select
          options={statusOptions}
          value={selectedStatus}
          onChange={setSelectedStatus}
          placeholder="Active"
          className="option_select"
        />
        <Select
          options={tierOptions}
          value={selectedTier}
          onChange={setSelectedTier}
          placeholder="Starter"
          className="option_select"
        />
        <Select
          options={codCycleOptions}
          value={selectedCodCycle}
          onChange={setSelectedCodCycle}
          placeholder="COD Cycle"
          className="option_select"
        />
        <div className="action_buttons">
          <RippleButton className="export_btn">
            <Download size={16} />
            Export
          </RippleButton>
          <RippleButton className="import_btn">
            <Upload size={16} />
            Import
          </RippleButton>
          <RippleButton className="add_merchant_btn" variant="primary">
            <Plus size={16} />
            Add Merchant
          </RippleButton>
        </div>
      </div>
      <div className="orders_container">
        <div className="table-responsive">
          <div className="order_table_wrapper">
            <table className="order_table">
              <thead>
                <tr>
                  <th>
                    <RippleButton
                      className="checkbox_wrapper"
                      onClick={handleSelectAll}
                    >
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        readOnly
                        className="form-check-input"
                      />
                    </RippleButton>
                  </th>
                  <th>Merchant ID</th>
                  <th>Business Name</th>
                  <th>Owner</th>
                  <th>GSTIN</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th>COD Cycle</th>
                  <th>Pending COD</th>
                  <th>Last Active</th>
                  <th>Risk Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMerchants.map((merchant) => (
                  <tr key={merchant.id}>
                    <td>
                      <RippleButton
                        className="checkbox_wrapper"
                        onClick={() => handleCheckboxChange(merchant.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMerchants.includes(merchant.id)}
                          readOnly
                          className="form-check-input"
                        />
                      </RippleButton>
                    </td>
                    <td className="merchant_id">{merchant.id}</td>
                    <td className="business_name">{merchant.businessName}</td>
                    <td className="owner">{merchant.owner}</td>
                    <td className="gstin">{merchant.gstin}</td>
                    <td>
                      <span
                        className="status_badge"
                        style={{
                          backgroundColor: `${
                            getTierBadgeColor(merchant.tier).bg
                          }20`,
                          color: getTierBadgeColor(merchant.tier).color,
                        }}
                      >
                        {merchant.tier}
                      </span>
                    </td>
                    <td>
                      <span
                        className="status_badge"
                        style={{
                          backgroundColor: `${
                            getStatusBadgeColor(merchant.status).bg
                          }20`,
                          color: getStatusBadgeColor(merchant.status).color,
                        }}
                      >
                        {merchant.status}
                      </span>
                    </td>
                    <td className="cod_cycle">{merchant.codCycle}</td>
                    <td className="pending_cod">
                      {formatCurrency(merchant.pendingCod)}
                    </td>
                    <td className="last_active">
                      {formatDate(merchant.lastActive)}
                    </td>
                    <td
                      className="risk_score"
                      style={{ color: getRiskScoreColor(merchant.riskScore) }}
                    >
                      {merchant.riskScore}/10
                    </td>
                    <td className="actions">
                      <div className="action_dropdown">
                        <RippleButton
                          className="action_trigger"
                          onClick={() =>
                            setShowActionDropdown(
                              showActionDropdown === merchant.id
                                ? null
                                : merchant.id
                            )
                          }
                        >
                          <MoreVertical size={16} />
                        </RippleButton>

                        {showActionDropdown === merchant.id && (
                          <div className="action_menu">
                            <button
                              className="action_item"
                              onClick={() =>
                                handleActionClick(merchant.id, "view")
                              }
                            >
                              <Eye size={14} />
                              View
                            </button>
                            <button
                              className="action_item"
                              onClick={() =>
                                handleActionClick(merchant.id, "edit")
                              }
                            >
                              <Edit size={14} />
                              Edit
                            </button>
                            <button
                              className="action_item"
                              onClick={() =>
                                handleActionClick(merchant.id, "suspend")
                              }
                            >
                              <UserX size={14} />
                              Suspend
                            </button>
                            <button
                              className="action_item"
                              onClick={() =>
                                handleActionClick(merchant.id, "reset_password")
                              }
                            >
                              <Key size={14} />
                              Reset Password
                            </button>
                            <button
                              className="action_item"
                              onClick={() =>
                                handleActionClick(merchant.id, "impersonate")
                              }
                            >
                              <UserCheck size={14} />
                              Impersonate
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMerchants.length === 0 && (
            <div className="no_data_found">
              <h6>No merchants found matching your criteria.</h6>
            </div>
          )}
        </div>

        {/* Pagination Container */}
        <div className="pagination_container">
          <div className="pagination_info">
            <div className="page_inf">
              <span>Rows per page:</span>
              <CustomSelect
                options={[10, 25, 50, 100]}
                value={rowsPerPage}
                onChange={(val) => {
                  setRowsPerPage(val);
                  setCurrentPage(1);
                }}
                className="rows_select"
              />
            </div>

            <div className="row_count">
              {filteredMerchants.length === 0
                ? "0 of 0"
                : `${startIndex + 1}–${Math.min(
                    endIndex,
                    filteredMerchants.length
                  )} of ${filteredMerchants.length}`}
            </div>

            <div className="pagination_controls">
              <RippleButton
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="pagination_btn"
              >
                <ChevronLeft size={16} />
              </RippleButton>
              <RippleButton
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="pagination_btn"
              >
                <ChevronRight size={16} />
              </RippleButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminMerchant;
