import React, { useState } from "react";
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RippleButton from "../components/RippleButton";
import { RefreshCw, Edit3, ChevronLeft, ChevronRight } from "lucide-react";
import Select from "react-select";
import { useFormik } from "formik";
import AdjustModal from "../components/AdjustModal";
import { FormModal } from "../components/CommonModal";
import CustomSelect from "../components/CustomSelect";

const payoutOptions = [
  { value: "Weekly", label: "Weekly" },
  { value: "Bi-weekly", label: "Bi-weekly" },
  { value: "Monthly", label: "Monthly" },
];

// Mock Order List data
const orderListData = [
  {
    orderId: "ORD-001",
    awb: "AWB001",
    deliveredDate: "2023-01-05",
    codAmount: "₹2,000",
    shippingCharge: "₹200",
    netOrderValue: "₹1,800",
    status: "Delivered",
  },
  {
    orderId: "ORD-002",
    awb: "AWB002",
    deliveredDate: "2023-01-04",
    codAmount: "₹1,500",
    shippingCharge: "₹150",
    netOrderValue: "₹1,350",
    status: "Delivered",
  },
  {
    orderId: "ORD-003",
    awb: "AWB003",
    deliveredDate: "2023-01-03",
    codAmount: "₹3,000",
    shippingCharge: "₹300",
    netOrderValue: "₹2,700",
    status: "Delivered",
  },
  {
    orderId: "ORD-004",
    awb: "AWB004",
    deliveredDate: "2023-01-02",
    codAmount: "₹800",
    shippingCharge: "₹80",
    netOrderValue: "₹720",
    status: "Delivered",
  },
  {
    orderId: "ORD-005",
    awb: "AWB005",
    deliveredDate: "2023-01-01",
    codAmount: "₹2,500",
    shippingCharge: "₹250",
    netOrderValue: "₹2,250",
    status: "Delivered",
  },
  {
    orderId: "ORD-006",
    awb: "AWB006",
    deliveredDate: "2022-12-31",
    codAmount: "₹1,200",
    shippingCharge: "₹120",
    netOrderValue: "₹1,080",
    status: "Delivered",
  },
  {
    orderId: "ORD-007",
    awb: "AWB007",
    deliveredDate: "2022-12-30",
    codAmount: "₹1,800",
    shippingCharge: "₹180",
    netOrderValue: "₹1,620",
    status: "Delivered",
  },
  {
    orderId: "ORD-008",
    awb: "AWB008",
    deliveredDate: "2022-12-29",
    codAmount: "₹2,200",
    shippingCharge: "₹220",
    netOrderValue: "₹1,980",
    status: "Delivered",
  },
  {
    orderId: "ORD-009",
    awb: "AWB009",
    deliveredDate: "2022-12-28",
    codAmount: "₹1,600",
    shippingCharge: "₹160",
    netOrderValue: "₹1,440",
    status: "Delivered",
  },
  {
    orderId: "ORD-010",
    awb: "AWB010",
    deliveredDate: "2022-12-27",
    codAmount: "₹2,800",
    shippingCharge: "₹280",
    netOrderValue: "₹2,520",
    status: "Delivered",
  },
  {
    orderId: "ORD-011",
    awb: "AWB011",
    deliveredDate: "2022-12-26",
    codAmount: "₹1,400",
    shippingCharge: "₹140",
    netOrderValue: "₹1,260",
    status: "Delivered",
  },
  {
    orderId: "ORD-012",
    awb: "AWB012",
    deliveredDate: "2022-12-25",
    codAmount: "₹3,200",
    shippingCharge: "₹320",
    netOrderValue: "₹2,880",
    status: "Delivered",
  },
];

// Mock Adjustment History data
const adjustmentHistoryData = [
  {
    id: 1,
    date: "2025-10-13",
    amount: "₹12",
    reason: "Late delivery penalty adjustment",
    adminName: "Admin User",
  },
  {
    id: 2,
    date: "2025-10-10",
    amount: "₹-50",
    reason: "Customer complaint refund",
    adminName: "Super Admin",
  },
  {
    id: 3,
    date: "2025-10-08",
    amount: "₹25",
    reason: "Service charge adjustment",
    adminName: "Admin User",
  },
  {
    id: 4,
    date: "2025-10-05",
    amount: "₹-15",
    reason: "Damaged goods compensation",
    adminName: "Finance Admin",
  },
  {
    id: 5,
    date: "2025-10-02",
    amount: "₹30",
    reason: "Express delivery bonus",
    adminName: "Admin User",
  },
];

const SuperAdminCodRemittanceDetails = () => {
  const { merchant } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialRowData = location.state?.rowData;
  const [merchantData, setMerchantData] = useState(initialRowData || {});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showEditChargesModal, setShowEditChargesModal] = useState(false);

  // Tab and pagination states
  const [activeTab, setActiveTab] = useState("orderList");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm] = useState("");

  // Tab configuration
  const navTabs = [
    { key: "orderList", label: "Order List" },
    { key: "adjustmentHistory", label: "Adjustment History" },
  ];

  // Mutable data states
  const [ordersData, setOrdersData] = useState(orderListData);
  const [adjustmentsData] = useState(adjustmentHistoryData);

  const parseAmount = (str) => {
    if (!str) return 0;
    return parseFloat(str.replace(/[^0-9.-]+/g, "")) || 0;
  };

  const formatAmount = (num) => {
    return Number.isInteger(num) ? `₹${num}` : `₹${num.toFixed(2)}`;
  };

  // payout formik
  const payoutFormik = useFormik({
    initialValues: {
      payoutCycle: merchantData?.payoutCycle || "Weekly",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      setMerchantData((prev) => ({
        ...prev,
        payoutCycle: values.payoutCycle,
      }));
      setShowPayoutModal(false);
    },
  });

  // payment formik
  const payFormik = useFormik({
    initialValues: {
      merchant: "",
      netPayable: "",
      transactionId: "",
      date: new Date().toISOString().split("T")[0],
    },
    validationSchema: Yup.object({
      transactionId: Yup.string().required("Transaction ID is required"),
      date: Yup.date().required("Date is required"),
    }),
    onSubmit: (values) => {
      // Confirm Payment
      setShowPaymentModal(false);
      navigate("/super-admin/cod-remittance");
    },
  });

  // adjust formik
  const adjustFormik = useFormik({
    initialValues: {
      merchant: "",
      amount: "",
      reason: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number().required("Amount is required"),
      reason: Yup.string().required("Reason is required"),
    }),
    onSubmit: (values) => {
      const grossCod = parseAmount(merchantData.grossCod);
      const shippingCharges = parseAmount(merchantData.shippingCharges);
      const newAdjustmentTotal = Number(values.amount);
      const newNetPayable = grossCod - shippingCharges + newAdjustmentTotal;

      setMerchantData((prev) => ({
        ...prev,
        adjustments: formatAmount(newAdjustmentTotal),
        netPayable: formatAmount(newNetPayable),
      }));

      setShowAdjustModal(false);
    },
  });

  // edit charges formik
  const editChargesFormik = useFormik({
    initialValues: {
      orderId: "",
      currentCharge: "",
      newCharge: "",
    },
    validationSchema: Yup.object({
      newCharge: Yup.number()
        .min(0, "Charge must be positive")
        .required("New charge is required"),
    }),
    onSubmit: (values) => {
      // Update the order data with new shipping charge
      setOrdersData((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === values.orderId
            ? {
                ...order,
                shippingCharge: formatAmount(values.newCharge),
                netOrderValue: formatAmount(
                  parseAmount(order.codAmount) - values.newCharge
                ),
              }
            : order
        )
      );

      // Update merchant data totals
      const updatedOrders = ordersData.map((order) =>
        order.orderId === values.orderId
          ? {
              ...order,
              shippingCharge: formatAmount(values.newCharge),
              netOrderValue: formatAmount(
                parseAmount(order.codAmount) - values.newCharge
              ),
            }
          : order
      );

      const totalShippingCharges = updatedOrders.reduce(
        (sum, order) => sum + parseAmount(order.shippingCharge),
        0
      );
      const totalCodAmount = updatedOrders.reduce(
        (sum, order) => sum + parseAmount(order.codAmount),
        0
      );
      const currentAdjustments = parseAmount(merchantData.adjustments);
      const newNetPayable =
        totalCodAmount - totalShippingCharges + currentAdjustments;

      setMerchantData((prev) => ({
        ...prev,
        grossCod: formatAmount(totalCodAmount),
        shippingCharges: formatAmount(totalShippingCharges),
        netPayable: formatAmount(newNetPayable),
      }));

      console.log(
        "Updated shipping charge for order:",
        values.orderId,
        "New charge:",
        values.newCharge
      );
      setShowEditChargesModal(false);
    },
  });

  // button handlers
  const handlePayClick = () => {
    const cleanAmount = parseAmount(merchantData.netPayable);
    payFormik.setValues({
      merchant: merchantData.merchant || "",
      netPayable: `₹${cleanAmount.toLocaleString("en-IN")}`,
      transactionId: "",
      date: new Date().toISOString().split("T")[0],
    });
    setShowPaymentModal(true);
  };

  const handleAdjustClick = () => {
    adjustFormik.resetForm({
      values: {
        merchant: merchantData.merchant || "",
        amount: parseAmount(merchantData.adjustments),
        reason: "",
      },
    });
    setShowAdjustModal(true);
  };

  const handleEditChargesClick = (order) => {
    editChargesFormik.setValues({
      orderId: order.orderId,
      currentCharge: order.shippingCharge,
      newCharge: parseAmount(order.shippingCharge),
    });
    setShowEditChargesModal(true);
  };

  // Tab handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when switching tabs
  };

  // Pagination logic
  const filteredOrders = ordersData.filter((order) =>
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Adjustment history pagination
  const adjustmentTotalPages = Math.ceil(adjustmentsData.length / rowsPerPage);
  const adjustmentStartIndex = (currentPage - 1) * rowsPerPage;
  const adjustmentEndIndex = adjustmentStartIndex + rowsPerPage;
  const currentAdjustments = adjustmentsData.slice(
    adjustmentStartIndex,
    adjustmentEndIndex
  );

  // no data case render
  if (!merchantData?.merchant) {
    return <h1>No Data Found for {decodeURIComponent(merchant)}</h1>;
  }

  return (
    <>
      {/* main section */}
      <div className="shipping_charge_section">
        <div className="page_header">
          <h1>{merchantData?.merchant}</h1>
          <RippleButton className="refresh_button">
            <RefreshCw size={20} /> Refresh data
          </RippleButton>
        </div>
        <div className="merchant_information">
          <div className="merchant_left">
            <h5>Merchant Information</h5>
            <div className="main">
              <div className="merchant_details">
                <h6>Contact Email:</h6>
                <p>contact@storeb.com</p>
              </div>
              <div className="merchant_details">
                <h6>Contact Phone:</h6>
                <p>9876543211</p>
              </div>
              <div className="merchant_details">
                <h6>GST Number:</h6>
                <p>22BBBBB0000B1Z5</p>
              </div>
              <div className="merchant_details">
                <h6>Payout Cycle:</h6>
                <p>{merchantData?.payoutCycle}</p>
              </div>
              <RippleButton
                className="update_payout_cycle_button"
                onClick={() => setShowPayoutModal(true)}
              >
                Update Payout Cycle
              </RippleButton>
            </div>
            <div className="main">
              <h4>Bank Account Details</h4>
              <div className="merchant_details">
                <h6>Account Holder:</h6>
                <p>Store B Pvt Ltd</p>
              </div>
              <div className="merchant_details">
                <h6>Account Number:</h6>
                <p>0987654321</p>
              </div>
              <div className="merchant_details">
                <h6>Bank Name:</h6>
                <p>HDFC Bank</p>
              </div>
              <div className="merchant_details">
                <h6>IFSC Code:</h6>
                <p>EFGH0005678</p>
              </div>
            </div>
          </div>
          <div className="merchant_right">
            <h5>Payment Summary</h5>
            <div className="payment_main">
              <div className="payment">
                <h6>Gross COD:</h6>
                <p>{merchantData?.grossCod}</p>
              </div>
              <div className="payment">
                <h6>Shipping Charges:</h6>
                <p>{merchantData?.shippingCharges}</p>
              </div>
              <div className="payment">
                <h6>Adjustments:</h6>
                <p
                  style={{
                    color: merchantData?.adjustments?.includes("")
                      ? "#ef4444"
                      : "#16a34a",
                  }}
                >
                  {merchantData?.adjustments}
                </p>
              </div>
              <div className="payment">
                <h6>Net Payable:</h6>
                <p>{merchantData?.netPayable}</p>
              </div>
            </div>
            <div className="payment_main2">
              <div className="status_main">
                <h6>Status</h6>
                <div className="status_badge">{merchantData?.status}</div>
              </div>
              <div className="btn_main">
                <RippleButton
                  className="adjust_button"
                  onClick={handleAdjustClick}
                >
                  Adjustment
                </RippleButton>
                <RippleButton className="pay_button" onClick={handlePayClick}>
                  Mark as Paid
                </RippleButton>
              </div>
            </div>
          </div>
        </div>

        {/* Order List Section */}
        <div className="orders_container">
          <div className="tab_header">
            <ul className="nav_tabs">
              {navTabs.map((tab) => (
                <li key={tab.key}>
                  <RippleButton
                    className={`tab_btn ${
                      activeTab === tab.key ? "active" : ""
                    }`}
                    onClick={() => handleTabChange(tab.key)}
                  >
                    {tab.label}
                    <span className="tab_count">
                      {tab.key === "orderList"
                        ? filteredOrders.length
                        : adjustmentsData.length}
                    </span>
                  </RippleButton>
                </li>
              ))}
            </ul>
          </div>
          <div className="table-responsive">
            <div className="order_table_wrapper">
              {activeTab === "orderList" ? (
                <table className="order_table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>AWB</th>
                      <th>Delivered Date</th>
                      <th>COD Amount</th>
                      <th>Shipping Charge</th>
                      <th>Net Order Value</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order, index) => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.awb}</td>
                        <td>{order.deliveredDate}</td>
                        <td className="amount">{order.codAmount}</td>
                        <td className="amount">{order.shippingCharge}</td>
                        <td className="amount">{order.netOrderValue}</td>
                        <td>
                          <span className="status_badge delivered">
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <RippleButton
                            className="edit_charges_btn"
                            onClick={() => handleEditChargesClick(order)}
                          >
                            <Edit3 size={14} />
                            Edit Charges
                          </RippleButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="order_table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Reason</th>
                      <th>Admin Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAdjustments.map((adjustment, index) => (
                      <tr key={adjustment.id}>
                        <td>{adjustment.date}</td>
                        <td
                          className={`amount ${
                            parseAmount(adjustment.amount) >= 0
                              ? "positive"
                              : "negative"
                          }`}
                        >
                          {adjustment.amount}
                        </td>
                        <td>{adjustment.reason}</td>
                        <td>{adjustment.adminName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
                {activeTab === "orderList"
                  ? currentOrders.length === 0
                    ? "0 of 0"
                    : `${startIndex + 1}–${Math.min(
                        endIndex,
                        filteredOrders.length
                      )} of ${filteredOrders.length}`
                  : currentAdjustments.length === 0
                  ? "0 of 0"
                  : `${adjustmentStartIndex + 1}–${Math.min(
                      adjustmentEndIndex,
                      adjustmentsData.length
                    )} of ${adjustmentsData.length}`}
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
                  disabled={
                    currentPage ===
                    (activeTab === "orderList"
                      ? totalPages
                      : adjustmentTotalPages)
                  }
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        activeTab === "orderList"
                          ? totalPages
                          : adjustmentTotalPages
                      )
                    )
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
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        title="Update Payout Cycle"
        onSubmit={payoutFormik.handleSubmit}
        submitText="Update Cycle"
        cancelText="Cancel"
        submitButtonProps={{
          disabled: !payoutFormik.isValid,
          className: "save-btn",
        }}
        cancelButtonProps={{
          className: "cancel-btn",
        }}
      >
        <div className="input_main">
          <label>Payout Cycle</label>
          <Select
            name="payoutCycle"
            value={payoutOptions.find(
              (opt) => opt.value === payoutFormik.values.payoutCycle
            )}
            onChange={(option) =>
              payoutFormik.setFieldValue("payoutCycle", option.value)
            }
            className="option_select"
            options={payoutOptions}
          />
        </div>
      </FormModal>

      <FormModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Mark Payment as Paid"
        onSubmit={payFormik.handleSubmit}
        submitText="Confirm Payment"
        cancelText="Cancel"
        submitButtonProps={{
          disabled: !payFormik.isValid || !payFormik.dirty,
          className: "save-btn",
        }}
        cancelButtonProps={{
          className: "cancel-btn",
        }}
      >
        <div className="input_main">
          <label>Store Name</label>
          <input type="text" value={payFormik.values.merchant} readOnly />
        </div>
        <div className="input_main">
          <label>Amount</label>
          <input type="text" value={payFormik.values.netPayable} readOnly />
        </div>
        <div className="input_main">
          <label>
            Transaction ID <span>*</span>
          </label>
          <input
            type="text"
            name="transactionId"
            value={payFormik.values.transactionId}
            onChange={payFormik.handleChange}
            onBlur={payFormik.handleBlur}
          />
          {payFormik.touched.transactionId &&
            payFormik.errors.transactionId && (
              <div className="error">{payFormik.errors.transactionId}</div>
            )}
        </div>
        <div className="input_main">
          <label>
            Payment Date<span>*</span>
          </label>
          <input
            type="date"
            name="date"
            value={payFormik.values.date}
            onChange={payFormik.handleChange}
          />
        </div>
      </FormModal>

      {showAdjustModal && (
        <AdjustModal
          formik={adjustFormik}
          setShowAdjustModal={setShowAdjustModal}
        />
      )}

      <FormModal
        isOpen={showEditChargesModal}
        onClose={() => {
          setShowEditChargesModal(false);
        }}
        title="Edit Shipping Charge"
        onSubmit={editChargesFormik.handleSubmit}
        submitText="Update Charge"
        cancelText="Cancel"
        submitButtonProps={{
          disabled: !editChargesFormik.isValid || !editChargesFormik.dirty,
          className: "save-btn",
        }}
        cancelButtonProps={{
          className: "cancel-btn",
        }}
      >
        <div className="input_main">
          <label>Order ID</label>
          <input
            type="text"
            value={editChargesFormik.values.orderId}
            readOnly
          />
        </div>
        <div className="input_main">
          <label>Current Charge</label>
          <input
            type="text"
            value={editChargesFormik.values.currentCharge}
            readOnly
          />
        </div>
        <div className="input_main">
          <label>
            New Charge <span>*</span>
          </label>
          <input
            type="number"
            name="newCharge"
            value={editChargesFormik.values.newCharge}
            onChange={editChargesFormik.handleChange}
            onBlur={editChargesFormik.handleBlur}
            placeholder="Enter new charge amount"
          />
          {editChargesFormik.touched.newCharge &&
            editChargesFormik.errors.newCharge && (
              <div className="error">{editChargesFormik.errors.newCharge}</div>
            )}
        </div>
      </FormModal>
    </>
  );
};

export default SuperAdminCodRemittanceDetails;
