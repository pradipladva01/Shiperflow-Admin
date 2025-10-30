import React, { useState } from "react";
import { shipmentsOrderData } from "../data/OrderData";
import { Link } from "react-router-dom";
import RippleButton from "../components/RippleButton";
import Select from "react-select";
import {
  ArrowDownToLine,
  ChevronLeft,
  ChevronRight,
  CircleX,
  FunnelPlus,
  X,
} from "lucide-react";
import CustomSelect from "../components/CustomSelect";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { generateShippingLabelPDF } from "../components/generateShippingLabelPDF";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FormModal } from "../components/CommonModal";
dayjs.extend(isBetween);

const navTabs = [
  { key: "all", label: "All Orders" },
  { key: "booked", label: "Booked Orders" },
  { key: "pending-pickup", label: "Pending Pickup" },
  { key: "in-transit", label: "In Transit" },
  { key: "out-for-delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
  { key: "lost", label: "Lost" },
  { key: "damaged", label: "Damaged" },
  { key: "rto-all", label: "RTO All" },
  { key: "rto-in-transit", label: "RTO In Transit" },
  { key: "rto-delivered", label: "RTO Delivered" },
  { key: "rto-lost", label: "RTO Lost" },
  { key: "rto-damaged", label: "RTO Damaged" },
];

const channelOptions = [{ value: "custom-order", label: "Custom Order" }];
const typeOptions = [
  { value: "all", label: "All" },
  { value: "cod", label: "COD" },
  { value: "prepaid", label: "Prepaid" },
  { value: "reverse", label: "Reverse" },
];
const warehouseOptions = [
  { value: "all", label: "All" },
  { value: "yogichowk", label: "Yogichowk" },
  { value: "dabholi", label: "Dabholi" },
];

const SuperAdminShipments = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [fromDate, setFromDate] = useState("2021-01-02");
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderIds, setOrderIds] = useState("");
  const [awbNos, setAwbNos] = useState("");
  const [productName, setProductName] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState(null);

  const [orders, setOrders] = useState(shipmentsOrderData);

  const formatDate = (date) => dayjs(date).format("MM/DD/YYYY");

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
    typeof status === "string"
      ? status.toLowerCase().replace(/\s+/g, "-")
      : "unknown";

  const normalizedTab = activeTab === "all" ? null : activeTab;

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

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
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
    const normalizedTab = activeTab === "all" ? null : activeTab;

    const from = dayjs(fromDate);
    const to = dayjs(toDate);

    const result = shipmentsOrderData.filter((order) => {
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
        selectedType.value === "all" ||
        (order.paymentMode &&
          order.paymentMode.toLowerCase() === selectedType.value.toLowerCase());

      const matchWarehouse =
        !selectedWarehouse || selectedWarehouse.value === order.warehouse;

      const matchOrderIds =
        !orderIds ||
        orderIds
          .split(",")
          .map((id) => id.trim())
          .includes(order.id.toString());

      const matchAwbNos =
        !awbNos ||
        awbNos
          .split(",")
          .map((awb) => awb.trim())
          .includes(order.awbNumber.toString());

      const matchProduct =
        !productName ||
        order.product.toLowerCase().includes(productName.toLowerCase());

      const matchQuery =
        !searchQuery ||
        Object.values(order)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return (
        isInDateRange &&
        matchStatus &&
        matchChannel &&
        matchType &&
        matchWarehouse &&
        matchOrderIds &&
        matchAwbNos &&
        matchProduct &&
        matchQuery
      );
    });

    setFilteredOrders(result);
    setCurrentPage(1);
    setFiltersApplied(true);
  };

  const handleClearFilters = () => {
    setSelectedChannel(null);
    setSelectedType(null);
    setSelectedWarehouse(null);
    setOrderIds("");
    setSearchQuery("");
    setAwbNos("");
    setProductName("");
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

  const handleExcelExport = () => {
    // Get all shipments data (not just paginated)
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
    XLSX.utils.book_append_sheet(wb, ws, "Shipments");

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Create blob and download
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const fileName = `shipments_export_${dayjs().format(
      "YYYY-MM-DD_HH-mm-ss"
    )}.xlsx`;

    saveAs(data, fileName);
  };

  return (
    <>
      <div className="shipment_section">
        <div className="page_header">
          <h1>Shipments</h1>
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
                <h6>Search Query:</h6>
                <input
                  type="text"
                  placeholder="Search anything"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="input_main">
                <h6>AWB NO's:</h6>
                <input
                  type="text"
                  placeholder="AWB NO's separated by comma"
                  value={awbNos}
                  onChange={(e) => setAwbNos(e.target.value)}
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
                <h6>Warehouse:</h6>
                <Select
                  defaultValue={selectedWarehouse}
                  onChange={setSelectedWarehouse}
                  options={warehouseOptions}
                  className="option_select"
                  placeholder="Select warehouse"
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
                      {tab.key === "all"
                        ? filtersApplied
                          ? filteredOrders.length
                          : orders.length
                        : (filtersApplied
                            ? filteredOrders
                            : shipmentsOrderData
                          ).filter(
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
              <div className="bulk_actions">
                {["all", "booked", "pending-pickup"].includes(activeTab) && (
                  <>
                    <span>{selectedOrders.length} selected</span>
                    <RippleButton
                      onClick={() =>
                        generateShippingLabelPDF(
                          orders.filter((order) =>
                            selectedOrders.includes(order.id)
                          )
                        )
                      }
                    >
                      Bulk Label
                    </RippleButton>

                    <RippleButton>Print Invoice</RippleButton>
                    <RippleButton>Print Pick List</RippleButton>
                    <RippleButton>Pickup</RippleButton>
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
                  </>
                )}
                <RippleButton
                  style={{ marginLeft: "auto" }}
                  onClick={handleExcelExport}
                >
                  Excel Export
                </RippleButton>
              </div>
            )}
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
                          checked={isAllSelected}
                          readOnly
                        />
                      </RippleButton>
                    </th>
                    <th>Order ID</th>
                    <th>Channel</th>
                    <th>Shopify ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Courier</th>
                    <th>AWB</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <>
                      <tr key={order.id}>
                        <td>
                          <RippleButton
                            className="checkbox_wrapper"
                            onClick={() => handleCheckboxChange(order.id)}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              readOnly
                              checked={selectedOrders.includes(order.id)}
                            />
                          </RippleButton>
                        </td>
                        <td className="order_id">{order.id}</td>
                        <td>{order.channel}</td>
                        <td>{order.shopifyId}</td>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                        <td>{order.customer}</td>
                        <td>{order.product}</td>
                        <td>{order.amount}</td>
                        <td>
                          <span
                            className="status_badge"
                            style={{
                              backgroundColor:
                                order.paymentMode === "COD"
                                  ? "#f9731620"
                                  : "#10b98120",
                              color:
                                order.paymentMode === "COD"
                                  ? "#f97316"
                                  : "#10b981",
                            }}
                          >
                            {order.paymentMode}
                          </span>
                        </td>

                        <td>{order.courier}</td>
                        <td>
                          <Link>{order.awbNumber}</Link>
                        </td>
                        <td>
                          <span
                            className="status_badge"
                            style={{
                              backgroundColor: `${order.color}20`,
                              color: `${order.color}`,
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="action_column">
                          {["Pending Pickup", "Booked"].includes(
                            order.status
                          ) ? (
                            <div className="action_buttons">
                              <RippleButton
                                className="download_btn"
                                // onClick={() => handleDownloadLabel(order)}
                              >
                                <ArrowDownToLine />
                              </RippleButton>
                              <RippleButton
                                onClick={() => {
                                  setSelectedCancelOrder(order);
                                  setShowCancelOrderModal(true);
                                }}
                              >
                                <CircleX style={{ color: "red" }} />
                              </RippleButton>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
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
    </>
  );
};

export default SuperAdminShipments;
