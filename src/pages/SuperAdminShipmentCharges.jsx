import React, { useState } from "react";
import RippleButton from "../components/RippleButton";
import CustomSelect from "../components/CustomSelect";
import Select from "react-select";
import ShippingChargesDetailsDrawer from "../components/ShippingChargesDetailsDrawer";
import {
  Search,
  Calendar,
  RefreshCw,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Eye,
  AlertTriangle,
  FileText,
  Edit,
  Package,
  Scale,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SuperAdminShipmentCharges = () => {
  // State management
  const [activeTab, setActiveTab] = useState("allOrders");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Drawer state management
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState(null);

  // Filter states for React Select
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Options for React Select dropdowns
  const merchantOptions = [
    { value: "all", label: "All Merchants" },
    { value: "fashion", label: "Fashion Hub" },
    { value: "tech", label: "Tech Store" },
    { value: "book", label: "Book World" },
    { value: "electronics", label: "Electronics Pro" },
    { value: "home", label: "Home Decor" },
  ];

  const courierOptions = [
    { value: "all", label: "All Couriers" },
    { value: "bluedart", label: "BlueDart" },
    { value: "delhivery", label: "Delhivery" },
    { value: "dtdc", label: "DTDC" },
    { value: "ecom", label: "Ecom Express" },
    { value: "xpressbees", label: "XpressBees" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "escalated", label: "Escalated" },
    { value: "resolved", label: "Resolved" },
    { value: "none", label: "None" },
  ];

  const dateOptions = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
  ];

  // Mock data for shipping charges audit
  const mockData = [
    {
      id: "ORD-2024-001",
      merchant: "Fashion Hub",
      courier: "BlueDart",
      declaredWeight: "0.5 kg",
      chargedWeight: "1.2 kg",
      declaredCharges: "₹45",
      fshipCharges: "₹108",
      difference: 63,
      percentageDiff: 140.0,
      disputeStatus: "open",
      lastUpdated: "2024-10-02",
    },
    {
      id: "ORD-2024-002",
      merchant: "Tech Store",
      courier: "Delhivery",
      declaredWeight: "2 kg",
      chargedWeight: "2.1 kg",
      declaredCharges: "₹120",
      fshipCharges: "₹126",
      difference: 6,
      percentageDiff: 5.0,
      disputeStatus: "none",
      lastUpdated: "2024-10-02",
    },
    {
      id: "ORD-2024-003",
      merchant: "Book World",
      courier: "DTDC",
      declaredWeight: "1.5 kg",
      chargedWeight: "2.8 kg",
      declaredCharges: "₹85",
      fshipCharges: "₹168",
      difference: 83,
      percentageDiff: 97.6,
      disputeStatus: "escalated",
      lastUpdated: "2024-10-01",
    },
    {
      id: "ORD-2024-004",
      merchant: "Electronics Pro",
      courier: "Ecom Express",
      declaredWeight: "0.8 kg",
      chargedWeight: "0.9 kg",
      declaredCharges: "₹55",
      fshipCharges: "₹62",
      difference: 7,
      percentageDiff: 12.7,
      disputeStatus: "resolved",
      lastUpdated: "2024-09-30",
    },
    {
      id: "ORD-2024-005",
      merchant: "Home Decor",
      courier: "XpressBees",
      declaredWeight: "3 kg",
      chargedWeight: "4.5 kg",
      declaredCharges: "₹180",
      fshipCharges: "₹270",
      difference: 90,
      percentageDiff: 50.0,
      disputeStatus: "open",
      lastUpdated: "2024-10-03",
    },
    {
      id: "ORD-2024-006",
      merchant: "Fashion Hub",
      courier: "BlueDart",
      declaredWeight: "0.5 kg",
      chargedWeight: "1.2 kg",
      declaredCharges: "₹45",
      fshipCharges: "₹108",
      difference: 63,
      percentageDiff: 140.0,
      disputeStatus: "open",
      lastUpdated: "2024-10-02",
    },
  ];

  // Filter data based on active tab and filters
  const getFilteredData = () => {
    let filtered = mockData;

    if (activeTab === "discrepancies") {
      filtered = mockData.filter(
        (item) =>
          item.disputeStatus !== "none" && item.disputeStatus !== "resolved"
      );
    } else if (activeTab === "historyDisputes") {
      filtered = mockData.filter(
        (item) =>
          item.disputeStatus === "resolved" ||
          item.disputeStatus === "escalated"
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.courier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply merchant filter
    if (selectedMerchant && selectedMerchant.value !== "all") {
      const merchantMap = {
        fashion: "Fashion Hub",
        tech: "Tech Store",
        book: "Book World",
        electronics: "Electronics Pro",
        home: "Home Decor",
      };
      filtered = filtered.filter(
        (item) => item.merchant === merchantMap[selectedMerchant.value]
      );
    }

    // Apply courier filter
    if (selectedCourier && selectedCourier.value !== "all") {
      const courierMap = {
        bluedart: "BlueDart",
        delhivery: "Delhivery",
        dtdc: "DTDC",
        ecom: "Ecom Express",
        xpressbees: "XpressBees",
      };
      filtered = filtered.filter(
        (item) => item.courier === courierMap[selectedCourier.value]
      );
    }

    // Apply status filter
    if (selectedStatus && selectedStatus.value !== "all") {
      filtered = filtered.filter(
        (item) => item.disputeStatus === selectedStatus.value
      );
    }

    // Apply date filter (simplified for demo)
    if (selectedDate && selectedDate.value !== "all") {
      // This is a simplified date filter - in real implementation, you'd compare actual dates
      // For demo purposes, we'll show all data regardless of date selection
      switch (selectedDate.value) {
        case "today":
          filtered = filtered.filter(() => true); // Show all for demo
          break;
        case "week":
          filtered = filtered.filter(() => true); // Show all for demo
          break;
        case "month":
          filtered = filtered.filter(() => true); // Show all for demo
          break;
        case "quarter":
          filtered = filtered.filter(() => true); // Show all for demo
          break;
        default:
          break;
      }
    }

    return filtered;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayData = filteredData.slice(startIndex, endIndex);

  // Update filtersApplied state
  React.useEffect(() => {
    const hasActiveFilters = () => {
      return (
        selectedMerchant?.value !== "all" ||
        selectedCourier?.value !== "all" ||
        selectedStatus?.value !== "all" ||
        selectedDate?.value !== "all" ||
        searchTerm !== ""
      );
    };

    setFiltersApplied(hasActiveFilters());
  }, [
    selectedMerchant,
    selectedCourier,
    selectedStatus,
    selectedDate,
    searchTerm,
  ]);

  // Custom styles for React Select
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "40px",
      border: "1px solid #e1e5e9",
      borderRadius: "8px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.1)" : "none",
      "&:hover": {
        borderColor: "#cbd5e0",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 8px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0",
      padding: "0",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "8px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#f1f5f9"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:hover": {
        backgroundColor: state.isSelected ? "#3b82f6" : "#f1f5f9",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#374151",
      fontSize: "14px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "14px",
    }),
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    const totalOrders = mockData.length;
    const discrepancyOrders = mockData.filter(
      (item) =>
        item.disputeStatus !== "none" && item.disputeStatus !== "resolved"
    ).length;

    const totalWeightDiff = mockData.reduce((sum, item) => {
      const declared = parseFloat(item.declaredWeight);
      const charged = parseFloat(item.chargedWeight);
      return sum + (charged - declared);
    }, 0);

    const totalAmountDiff = mockData.reduce(
      (sum, item) => sum + item.difference,
      0
    );
    const extraCharges = totalAmountDiff;

    return {
      totalOrders,
      weightDiff: totalWeightDiff.toFixed(1),
      amountDiff: totalAmountDiff,
      discrepancyOrders,
      extraCharges,
      weightVariance: (
        (totalWeightDiff /
          mockData.reduce(
            (sum, item) => sum + parseFloat(item.declaredWeight),
            0
          )) *
        100
      ).toFixed(1),
      amountVariance: (
        (totalAmountDiff /
          mockData.reduce(
            (sum, item) =>
              sum + parseInt(item.declaredCharges.replace("₹", "")),
            0
          )) *
        100
      ).toFixed(1),
    };
  };

  const summary = calculateSummary();

  // Tab configuration
  const tabs = [
    { key: "allOrders", label: "All Orders", count: summary.totalOrders },
    {
      key: "discrepancies",
      label: "Discrepancies",
      count: summary.discrepancyOrders,
    },
    {
      key: "historyDisputes",
      label: "History & Disputes",
      count: mockData.filter(
        (item) =>
          item.disputeStatus === "resolved" ||
          item.disputeStatus === "escalated"
      ).length,
    },
  ];

  // Handle row selection
  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === displayData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(displayData.map((item) => item.id));
    }
  };

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Get dispute status badge
  const getDisputeStatusBadge = (status) => {
    const statusConfig = {
      open: { className: "open", label: "Open" },
      escalated: { className: "escalated", label: "Escalated" },
      resolved: { className: "resolved", label: "Resolved" },
      none: { className: "none", label: "None" },
    };

    const config = statusConfig[status] || statusConfig.none;
    return (
      <span className={`dispute_status ${config.className}`}>
        {config.label}
      </span>
    );
  };

  // Get difference styling
  const getDifferenceStyle = (value, type = "amount") => {
    if (type === "amount") {
      if (value > 50) return "positive";
      if (value > 0) return "neutral";
      return "negative";
    } else {
      if (value > 100) return "high";
      if (value > 20) return "medium";
      return "low";
    }
  };

  // Drawer handlers
  const handleViewDetails = (orderData) => {
    setSelectedOrderData(orderData);
    setIsDrawerOpen(true);
    setShowActionDropdown(null); // Close any open dropdown
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedOrderData(null);
  };

  const handleAddNote = async (orderId, type, content) => {
    try {
      // Here you would typically make an API call to save the note
      // Adding adjustment for order
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error adding note:", error);
      throw error;
    }
  };

  const handleEscalate = async (orderId, reason) => {
    try {
      // Here you would typically make an API call to escalate the order
      // Escalating order
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error escalating order:", error);
      throw error;
    }
  };

  const handleResolve = async (orderId) => {
    try {
      // Here you would typically make an API call to resolve the dispute
      // Resolving dispute for order
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error resolving dispute:", error);
      throw error;
    }
  };

  const handleRaiseDispute = async (orderId) => {
    try {
      // Here you would typically make an API call to raise a dispute
      // Raising dispute for order
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error raising dispute:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="shipment_section super_admin_shipment_charges">
        {/* Header Section */}
        <div className="audit_header">
          <div className="header_content">
            <h1>Shipping Charges Audit</h1>
            <p>
              Compare merchant billing vs FShip billing to detect discrepancies
            </p>
          </div>
          <div className="header_actions">
            <div className="date_picker">
              <Calendar size={16} className="calendar_icon" />
              <span className="date_text">Today</span>
              <ChevronDown size={16} className="dropdown_arrow" />
            </div>
            <RippleButton className="refresh_button">
              <RefreshCw size={16} />
              Refresh Data
            </RippleButton>
          </div>
        </div>
        {/* Summary Cards */}
        <div className="audit_summary">
          <div className="summary_card">
            <div className="card_header">
              <h6 className="card_title">Total Orders Checked</h6>
              <div className="card_icon shipping">
                <Package size={20} />
              </div>
            </div>
            <h3 className="card_value">{summary.totalOrders}</h3>
            <p className="card_description">Orders audited today</p>
          </div>

          <div className="summary_card">
            <div className="card_header">
              <h6 className="card_title">Weight Difference</h6>
              <div className="card_icon weight">
                <Scale size={20} />
              </div>
            </div>
            <h3 className="card_value">{summary.weightDiff} kg</h3>
            <p className="card_description variance">
              {summary.weightVariance}% variance
            </p>
          </div>

          <div className="summary_card">
            <div className="card_header">
              <h6 className="card_title">Amount Difference</h6>
              <div className="card_icon amount">
                <DollarSign size={20} />
              </div>
            </div>
            <h3 className="card_value">₹{summary.amountDiff}</h3>
            <p className="card_description variance">
              {summary.amountVariance}% variance
            </p>
          </div>

          <div className="summary_card">
            <div className="card_header">
              <h6 className="card_title">Discrepancy Orders</h6>
              <div className="card_icon discrepancy">
                <AlertCircle size={20} />
              </div>
            </div>
            <h3 className="card_value">{summary.discrepancyOrders}</h3>
            <p className="card_description">
              {(
                (summary.discrepancyOrders / summary.totalOrders) *
                100
              ).toFixed(1)}
              % of total
            </p>
          </div>

          <div className="summary_card">
            <div className="card_header">
              <h6 className="card_title">Extra Charges</h6>
              <div className="card_icon extra">
                <TrendingUp size={20} />
              </div>
            </div>
            <h3 className="card_value">₹{summary.extraCharges}</h3>
            <p className="card_description collected">Collected by couriers</p>
          </div>
        </div>
        <div className="filters_section">
          <div style={{ position: "relative", flex: 1, minWidth: "300px" }}>
            <Search size={16} className="search_icon" />
            <input
              type="text"
              placeholder="Search orders, merchants, couriers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search_input"
            />
          </div>
          <div className="filter_dropdowns">
            <Select
              options={merchantOptions}
              value={selectedMerchant}
              onChange={setSelectedMerchant}
              placeholder="All Merchants"
              styles={customSelectStyles}
              className="react_select_filter"
              isClearable={false}
              isSearchable={false}
            />
            <Select
              options={courierOptions}
              value={selectedCourier}
              onChange={setSelectedCourier}
              placeholder="All Couriers"
              styles={customSelectStyles}
              className="react_select_filter"
              isClearable={false}
              isSearchable={false}
            />
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="All Status"
              styles={customSelectStyles}
              className="react_select_filter"
              isClearable={false}
              isSearchable={false}
            />
            <Select
              options={dateOptions}
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="All Dates"
              styles={customSelectStyles}
              className="react_select_filter"
              isClearable={false}
              isSearchable={false}
            />
          </div>
          <RippleButton className="advanced_button">
            <Filter size={16} />
            Advanced
          </RippleButton>
          <RippleButton className="export_button">
            <Download size={16} />
            Export
          </RippleButton>
        </div>
        <div className="orders_container">
          <div className="tab_header">
            <ul className="nav_tabs">
              {tabs.map((tab) => (
                <li key={tab.key}>
                  <RippleButton
                    className={`tab_btn ${
                      activeTab === tab.key ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                    <span className="tab_count">
                      {tab.key === "allOrders"
                        ? filtersApplied
                          ? filteredData.length
                          : mockData.length
                        : (filtersApplied ? filteredData : mockData).filter(
                            (data) => data.disputeStatus === tab.key
                          ).length}
                      {tab.count}
                    </span>
                  </RippleButton>
                </li>
              ))}
            </ul>
          </div>
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
                          className="form-check-input"
                          type="checkbox"
                          checked={
                            selectedRows.length === displayData.length &&
                            displayData.length > 0
                          }
                          readOnly
                        />
                      </RippleButton>
                    </th>
                    <th className="sortable" onClick={() => handleSort("id")}>
                      Order ID
                      {sortColumn === "id" && (
                        <ChevronUp
                          size={12}
                          className={`sort_icon ${
                            sortDirection === "asc" ? "active" : ""
                          }`}
                        />
                      )}
                    </th>
                    <th>Merchant</th>
                    <th>Courier</th>
                    <th>Declared Weight</th>
                    <th
                      className="sortable"
                      onClick={() => handleSort("chargedWeight")}
                    >
                      Charged Weight
                      {sortColumn === "chargedWeight" && (
                        <ChevronUp
                          size={12}
                          className={`sort_icon ${
                            sortDirection === "asc" ? "active" : ""
                          }`}
                        />
                      )}
                    </th>
                    <th>Declared Charges</th>
                    <th>FShip Charges</th>
                    <th>Difference (₹)</th>
                    <th>% Diff</th>
                    <th>Dispute Status</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((row, index) => (
                    <tr
                      key={row.id}
                      className={
                        row.disputeStatus !== "none" &&
                        row.disputeStatus !== "resolved"
                          ? "highlighted"
                          : ""
                      }
                    >
                      <td>
                        <RippleButton
                          className="checkbox_wrapper"
                          onClick={() => handleSelectRow(row.id)}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedRows.includes(row.id)}
                            readOnly
                          />
                        </RippleButton>
                      </td>
                      <td>
                        <span className="order_id">{row.id}</span>
                      </td>
                      <td>{row.merchant}</td>
                      <td>{row.courier}</td>
                      <td>{row.declaredWeight}</td>
                      <td>
                        <div className="weight_warning">
                          {row.chargedWeight}
                          <AlertTriangle size={12} className="warning_icon" />
                        </div>
                      </td>
                      <td>{row.declaredCharges}</td>
                      <td>{row.fshipCharges}</td>
                      <td>
                        <span
                          className={`difference_amount ${getDifferenceStyle(
                            row.difference
                          )}`}
                        >
                          +₹{row.difference}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`percentage_diff ${getDifferenceStyle(
                            row.percentageDiff,
                            "percentage"
                          )}`}
                        >
                          +{row.percentageDiff}%
                        </span>
                      </td>
                      <td>{getDisputeStatusBadge(row.disputeStatus)}</td>
                      <td>{row.lastUpdated}</td>
                      <td>
                        <div className="actions_dropdown">
                          <RippleButton
                            className="actions_button"
                            onClick={() =>
                              setShowActionDropdown(
                                showActionDropdown === row.id ? null : row.id
                              )
                            }
                          >
                            <MoreVertical size={16} />
                          </RippleButton>
                          {showActionDropdown === row.id && (
                            <div className="dropdown_menu">
                              <button
                                className="dropdown_item"
                                onClick={() => handleViewDetails(row)}
                              >
                                <Eye size={16} className="item_icon" />
                                View Details
                              </button>
                              <button className="dropdown_item">
                                <AlertTriangle
                                  size={16}
                                  className="item_icon"
                                />
                                Raise Dispute
                              </button>
                              <button className="dropdown_item">
                                <FileText size={16} className="item_icon" />
                                Add Note
                              </button>
                              <button className="dropdown_item">
                                <Edit size={16} className="item_icon" />
                                Adjust Charges
                              </button>
                              <button className="dropdown_item">
                                <Download size={16} className="item_icon" />
                                Export Row
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
          </div>
          <div className="pagination_container">
            <div className="pagination_info">
              <div className="page_inf">
                <span>Rows per page:</span>
                <CustomSelect
                  options={[10, 50, 100, 200, 500]}
                  value={rowsPerPage}
                  onChange={(val) => {
                    setRowsPerPage(val);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="row_count">
                {displayData.length === 0
                  ? "0 of 0"
                  : `${startIndex + 1}–${Math.min(
                      endIndex,
                      displayData.length
                    )} of ${displayData.length}`}
              </div>

              <div className="pagination_controls">
                <RippleButton
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  <ChevronLeft />
                </RippleButton>
                <RippleButton
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  <ChevronRight />
                </RippleButton>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Charges Details Drawer */}
      </div>
      <ShippingChargesDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        orderData={selectedOrderData}
        onAddNote={handleAddNote}
        onEscalate={handleEscalate}
        onResolve={handleResolve}
        onRaiseDispute={handleRaiseDispute}
      />
    </>
  );
};

export default SuperAdminShipmentCharges;
