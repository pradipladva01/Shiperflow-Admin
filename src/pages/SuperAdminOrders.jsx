import React, { useState, useEffect } from "react";
import { orderData } from "../data/OrderData";
import RippleButton from "../components/RippleButton";
import Select from "react-select";
import {
  ChevronLeft,
  ChevronRight,
  CircleX,
  FunnelPlus,
  X,
  MoreVertical,
} from "lucide-react";
import CustomSelect from "../components/CustomSelect";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import DataTable from "../components/DataTable";
import OrderDetailsDrawer from "../components/OrderDetailsDrawer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FormModal } from "../components/CommonModal";
dayjs.extend(isBetween);

const navTabs = [
  { key: "new", label: "New" },
  { key: "booked", label: "Booked" },
  { key: "cancelled", label: "Cancelled" },
  { key: "syncError", label: "Sync Error" },
  { key: "failed-orders", label: "Failed Orders" },
  { key: "not-shipped", label: "Not Shipped" },
];

const channelOptions = [{ value: "custom-order", label: "Custom Order" }];
const typeOptions = [
  { value: "all", label: "All" },
  { value: "cod", label: "COD" },
  { value: "prepaid", label: "Prepaid" },
  { value: "reverse", label: "Reverse" },
];

const getOrderDataColumns = (activeTab) => {
  const baseColumns = [
    { label: "Channel", accessor: "channel" },
    {
      label: "Order ID",
      accessor: "id",
      render: (val) => <span className="order_id">{val}</span>,
    },
    {
      label: "Order Date",
      accessor: "date",
      render: (val) => dayjs(val).format("DD/MM/YYYY"),
    },
    { label: "Product", accessor: "product" },
    { label: "Payment", accessor: "payment" },
    { label: "Collectable Amount", accessor: "collectableAmount" },
    {
      label: "Method",
      accessor: "method",
      render: (val) => (
        <span
          className="status_badge"
          style={{
            backgroundColor: val === "COD" ? "#f9731620" : "#10b98120",
            color: val === "COD" ? "#f97316" : "#10b981",
          }}
        >
          {val}
        </span>
      ),
    },
    { label: "Customer", accessor: "customer" },
    { label: "Zip Code", accessor: "zipCode" },
    {
      label: "Channel Tags",
      accessor: "channelTag",
      render: (val) => val || "-",
    },
    { label: "Weight", accessor: "weight" },
    {
      label: "Status",
      accessor: "status",
      render: (_, row) => (
        <span
          className="status_badge"
          style={{
            backgroundColor: `${row.statusColor}20`,
            color: row.statusColor,
          }}
        >
          {row.status}
        </span>
      ),
    },
  ];

  // Add tab-specific date column
  const tabLabels = {
    new: "New",
    booked: "Booked",
    manifested: "Manifested",
    pickups: "Pickups",
    inTransit: "In Transit",
    outForDelivery: "Out For Delivery",
    delivered: "Delivered",
    rto: "RTO",
    cancelled: "Cancelled",
    syncError: "Sync Error",
    draftAbandoned: "Draft / Abandoned",
    archived: "Archived",
    selfFulfilled: "Self Fulfilled",
    all: "All",
  };

  const tabLabel = tabLabels[activeTab];
  if (tabLabel) {
    const tabDateColumn = {
      label: `${tabLabel} Date`,
      accessor: "date",
      render: (val) => dayjs(val).format("DD/MM/YYYY"),
    };

    // Insert the tab-specific date column after Order Date
    baseColumns.splice(3, 0, tabDateColumn);
  }

  return baseColumns;
};

const SuperAdminOrders = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [fromDate, setFromDate] = useState("2021-01-02");
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderIds, setOrderIds] = useState("");
  const [productName, setProductName] = useState("");
  const [channelTag, setChannelTag] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState(null);
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showOrderDrawer, setShowOrderDrawer] = useState(false);
  const [selectedOrderForDrawer, setSelectedOrderForDrawer] = useState(null);

  const [orders, setOrders] = useState(orderData);

  const formatDate = (date) => dayjs(date).format("MM/DD/YYYY");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showActionDropdown &&
        !event.target.closest(".action_dropdown_container")
      ) {
        setShowActionDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActionDropdown]);

  const handleQuickSelect = (range) => {
    const today = dayjs();
    let from = "";
    let to = today;

    switch (range) {
      case "today":
        from = today;
        to = today;
        break;
      case "yesterday":
        from = today.subtract(1, "day");
        to = from;
        break;
      case "last7":
        from = today.subtract(6, "day");
        break;
      case "last30":
        from = today.subtract(29, "day");
        break;
      case "thisMonth":
        from = today.startOf("month");
        break;
      case "lastMonth":
        from = today.subtract(1, "month").startOf("month");
        to = today.subtract(1, "month").endOf("month");
        break;
      case "lifetime":
        from = dayjs("2021-01-02");
        break;
      default:
        return;
    }

    setFromDate(from.format("YYYY-MM-DD"));
    setToDate(to.format("YYYY-MM-DD"));
    setShowDropdown(false);
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const normalizeStatus = (status) =>
    typeof status === "string" ? status.toLowerCase().replace(/\s+/g, "-") : "";

  const normalizedTab = activeTab === "new" ? null : activeTab;

  const displayOrders = (
    filteredOrders.length > 0 || filtersApplied ? filteredOrders : orders
  ).filter(
    (order) => !normalizedTab || normalizeStatus(order.status) === normalizedTab
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedOrders = displayOrders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(displayOrders.length / rowsPerPage);

  const isAllSelected =
    paginatedOrders.length > 0 &&
    paginatedOrders.every((order) => selectedOrders.includes(order.id));

  const handleCheckboxChange = (id) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((orderId) => orderId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      const unselected = selectedOrders.filter(
        (id) => !paginatedOrders.some((order) => order.id === id)
      );
      setSelectedOrders(unselected);
    } else {
      const allIds = paginatedOrders.map((order) => order.id);
      const combinedIds = Array.from(new Set([...selectedOrders, ...allIds]));
      setSelectedOrders(combinedIds);
    }
  };

  const handleApplyFilters = () => {
    const normalizedTab = activeTab === "new" ? null : activeTab;

    const from = dayjs(fromDate);
    const to = dayjs(toDate);

    const result = orderData.filter((order) => {
      const orderDate = dayjs(order.date);

      const isInDateRange = orderDate.isValid()
        ? orderDate.isBetween(from, to, "day", "[]")
        : false;

      const matchStatus =
        !normalizedTab || normalizeStatus(order.status) === normalizedTab;

      const matchChannel =
        !selectedChannel || selectedChannel.value === order.channel;

      const matchType =
        !selectedType ||
        selectedType.value === "new" ||
        (order.method &&
          order.method.toLowerCase() === selectedType.value.toLowerCase());

      const matchOrderIds =
        !orderIds ||
        orderIds
          .split(",")
          .map((id) => id.trim())
          .includes(order.id.toString());

      const matchProduct =
        !productName ||
        order.product.toLowerCase().includes(productName.toLowerCase());

      const matchQuery =
        !searchQuery ||
        Object.values(order)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchChannelTag =
        !channelTag ||
        (order.channelTag &&
          order.channelTag.toLowerCase().includes(channelTag.toLowerCase()));

      return (
        isInDateRange &&
        matchStatus &&
        matchChannel &&
        matchType &&
        matchOrderIds &&
        matchProduct &&
        matchQuery &&
        matchChannelTag
      );
    });

    setFilteredOrders(result);
    setCurrentPage(1);
    setFiltersApplied(true);
  };

  const handleClearFilters = () => {
    setSelectedChannel(null);
    setSelectedType(null);
    setOrderIds("");
    setSearchQuery("");
    setProductName("");
    setChannelTag("");
    setFromDate("2021-01-02");
    setToDate(dayjs().format("YYYY-MM-DD"));
    setFilteredOrders([]);
    setCurrentPage(1);
    setFiltersApplied(false);
  };

  const handleSingleCancel = () => {
    if (!selectedCancelOrder) return;

    const updatedData = orders.map((o) =>
      o.id === selectedCancelOrder.id
        ? { ...o, status: "Cancelled", color: "#f87171" }
        : o
    );

    setOrders(updatedData);

    if (filtersApplied) {
      const from = dayjs(fromDate);
      const to = dayjs(toDate);

      const result = updatedData.filter((order) => {
        const orderDate = dayjs(order.date);
        const isInDateRange = orderDate.isValid()
          ? orderDate.isBetween(from, to, "day", "[]")
          : false;

        const matchStatus =
          !normalizedTab || normalizeStatus(order.status) === normalizedTab;

        return isInDateRange && matchStatus;
      });

      setFilteredOrders(result);
    }

    setShowCancelOrderModal(false);
    setSelectedCancelOrder(null);
  };

  const handleActionClick = (action, order) => {
    setShowActionDropdown(null);

    if (action === "View details") {
      setSelectedOrderForDrawer(order);
      setShowOrderDrawer(true);
    } else if (action === "Download Label") {
      // Download label for order
      // Add download label functionality here
    } else if (action === "Edit order") {
      // Edit order
      // Add edit order functionality here
    }
  };

  const handleCloseDrawer = () => {
    setShowOrderDrawer(false);
    setSelectedOrderForDrawer(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Update the order status in the orders state
      const updatedOrders = orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase()),
              statusColor: getStatusColor(newStatus),
            }
          : order
      );

      setOrders(updatedOrders);

      // Update filtered orders if filters are applied
      if (filtersApplied) {
        const from = dayjs(fromDate);
        const to = dayjs(toDate);
        const normalizedTab = activeTab === "new" ? null : activeTab;

        const result = updatedOrders.filter((order) => {
          const orderDate = dayjs(order.date);
          const isInDateRange = orderDate.isValid()
            ? orderDate.isBetween(from, to, "day", "[]")
            : false;

          const matchStatus =
            !normalizedTab || normalizeStatus(order.status) === normalizedTab;

          return isInDateRange && matchStatus;
        });

        setFilteredOrders(result);
      }

      // Update the selected order for drawer if it's the same order
      if (selectedOrderForDrawer && selectedOrderForDrawer.id === orderId) {
        const updatedOrder = updatedOrders.find(
          (order) => order.id === orderId
        );
        setSelectedOrderForDrawer(updatedOrder);
      }

      // Status changed for order
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };

  const handleAddNote = async (orderId, noteType, noteContent) => {
    try {
      // Here you would typically make an API call to save the note
      // Adding note for order
      // For now, we'll just log it. In a real application, you'd make an API call here
      // await api.addOrderNote(orderId, noteType, noteContent);
    } catch (error) {
      console.error("Error adding note:", error);
      throw error;
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      booked: "#3b82f6",
      "pending pickup": "#8b5cf6",
      "in transit": "#f59e0b",
      "out for delivery": "#ef4444",
      delivered: "#10b981",
      cancelled: "#6b7280",
      lost: "#dc2626",
      damaged: "#dc2626",
    };
    return statusColors[status.toLowerCase()] || "#6b7280";
  };

  const handleExcelExport = () => {
    // Get all orders data (not just paginated)
    const dataToExport = displayOrders;

    // Prepare data for Excel export
    const excelData = dataToExport.map((order) => ({
      Channel: order.channel,
      "Order ID": order.id,
      Date: dayjs(order.date).format("DD/MM/YYYY"),
      Product: order.product,
      Payment: order.payment,
      "Collectable Amount": order.collectableAmount,
      Method: order.method,
      Customer: order.customer,
      "Zip Code": order.zipCode,
      "Channel Tags": order.channelTag || "-",
      Weight: order.weight,
      Status: order.status,
      "Status Color": order.statusColor,
      "Raw Date": order.date, // Include raw date for reference
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better readability
    const colWidths = [
      { wch: 15 }, // Channel
      { wch: 12 }, // Order ID
      { wch: 12 }, // Date
      { wch: 25 }, // Product
      { wch: 15 }, // Payment
      { wch: 18 }, // Collectable Amount
      { wch: 10 }, // Method
      { wch: 20 }, // Customer
      { wch: 10 }, // Zip Code
      { wch: 15 }, // Channel Tags
      { wch: 10 }, // Weight
      { wch: 15 }, // Status
      { wch: 15 }, // Status Color
      { wch: 15 }, // Raw Date
    ];
    ws["!cols"] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Create blob and download
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const fileName = `orders_export_${dayjs().format(
      "YYYY-MM-DD_HH-mm-ss"
    )}.xlsx`;

    saveAs(data, fileName);
  };

  return (
    <>
      <div className="shipment_section">
        <div className="page_header">
          <h1>Order</h1>
          <RippleButton className="filter_btn" onClick={toggleFilters}>
            {showFilters ? <X /> : <FunnelPlus />}
            {showFilters ? "Close" : "Filter"}
          </RippleButton>
        </div>
        {showFilters && (
          <div className="filter_section">
            <div className="input_container_main">
              <div className="input_main">
                <h6>From Date:</h6>
                <input
                  type="text"
                  value={`${formatDate(fromDate)} - ${formatDate(toDate)}`}
                  readOnly
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <ul className="quick_select_dropdown">
                    {[
                      { label: "Today", value: "today" },
                      { label: "Yesterday", value: "yesterday" },
                      { label: "Last 7 Days", value: "last7" },
                      { label: "Last 30 Days", value: "last30" },
                      { label: "This Month", value: "thisMonth" },
                      { label: "Last Month", value: "lastMonth" },
                      { label: "Life Time", value: "lifetime" },
                    ].map((item) => (
                      <li
                        key={item.value}
                        onClick={() => handleQuickSelect(item.value)}
                        style={{
                          padding: "8px 16px",
                          cursor: "pointer",
                          hover: {
                            backgroundColor: "#f0f0f0",
                          },
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.background = "#f0f0f0")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.background = "transparent")
                        }
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="input_main">
                <h6>Order ID's:</h6>
                <input
                  type="text"
                  placeholder="Order ids separated by comma"
                  value={orderIds}
                  onChange={(e) => setOrderIds(e.target.value)}
                />
              </div>
              <div className="input_main">
                <h6>Product Name:</h6>
                <input
                  type="text"
                  placeholder="Product name to search"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="input_main">
                <h6>Search Query:</h6>
                <input
                  type="text"
                  placeholder="Search anything"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="input_main">
                <h6>Channel:</h6>
                <Select
                  defaultValue={selectedChannel}
                  onChange={setSelectedChannel}
                  options={channelOptions}
                  className="option_select"
                  placeholder="Select channel"
                />
              </div>
              <div className="input_main">
                <h6>Type:</h6>
                <Select
                  defaultValue={selectedType}
                  onChange={setSelectedType}
                  options={typeOptions}
                  className="option_select"
                  placeholder="Select type"
                />
              </div>
              <div className="input_main">
                <h6>Channel Tag's':</h6>
                <input
                  type="text"
                  placeholder="Channel tag to search"
                  value={channelTag}
                  onChange={(e) => setChannelTag(e.target.value)}
                />
              </div>
              <div className="filter_buttons">
                <RippleButton onClick={handleApplyFilters}>Apply</RippleButton>
                <RippleButton onClick={handleClearFilters}>Clear</RippleButton>
              </div>
            </div>
          </div>
        )}
        <div className="orders_container">
          <div className="tab_header">
            <ul className="nav_tabs">
              {navTabs.map((tab) => (
                <li key={tab.key}>
                  <RippleButton
                    className={`tab_btn ${
                      activeTab === tab.key ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                    <span className="tab_count">
                      {tab.key === "new"
                        ? filtersApplied
                          ? filteredOrders.length
                          : orders.length
                        : (filtersApplied ? filteredOrders : orderData).filter(
                            (order) => normalizeStatus(order.status) === tab.key
                          ).length}
                    </span>
                  </RippleButton>
                </li>
              ))}
            </ul>
          </div>
          <div className="table-responsive">
            {displayOrders.length > 0 && (
              <>
                <div className="bulk_actions">
                  <span>{selectedOrders.length} selected</span>
                  <RippleButton>Bulk Ship</RippleButton>
                  <RippleButton
                    style={{ color: "red" }}
                    disabled={
                      !paginatedOrders.some((order) =>
                        selectedOrders.includes(order.id)
                      )
                    }
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel
                  </RippleButton>
                  <RippleButton
                    style={{ marginLeft: "auto" }}
                    onClick={handleExcelExport}
                  >
                    Excel Export
                  </RippleButton>
                </div>
              </>
            )}
            <div className="order_table_wrapper">
              <DataTable
                columns={getOrderDataColumns(activeTab)}
                data={paginatedOrders}
                selectedRows={selectedOrders}
                onSelectRow={handleCheckboxChange}
                onSelectAll={handleSelectAll}
                isAllSelected={isAllSelected}
                stickyColumn={{ accessor: "status" }}
              />
            </div>
          </div>
          {displayOrders.length === 0 && (
            <h6 className="no_data_found">No orders found for this status.</h6>
          )}
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
                {displayOrders.length === 0
                  ? "0 of 0"
                  : `${startIndex + 1}–${Math.min(
                      endIndex,
                      displayOrders.length
                    )} of ${displayOrders.length}`}
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
      </div>
      <FormModal
        title="Cancel Orders"
        size="medium"
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSubmit={() => {
          const remainingSelected = selectedOrders.filter(
            (id) => !paginatedOrders.some((order) => order.id === id)
          );
          setSelectedOrders(remainingSelected);
          setShowCancelModal(false);
        }}
        submitText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to cancel the selected orders?</p>
      </FormModal>
      <FormModal
        title="Cancel Order"
        size="medium"
        submitText="Yes"
        isOpen={showCancelOrderModal && !!selectedCancelOrder}
        onClose={() => setShowCancelOrderModal(false)}
        onSubmit={() => handleSingleCancel(selectedCancelOrder)}
        cancelText="No"
      >
        <p>Are you sure you want to cancel this order?</p>
      </FormModal>

      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        isOpen={showOrderDrawer}
        onClose={handleCloseDrawer}
        orderData={selectedOrderForDrawer}
        onStatusChange={handleStatusChange}
        onAddNote={handleAddNote}
      />
    </>
  );
};

export default SuperAdminOrders;
