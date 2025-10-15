import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Diff,
  Eye,
} from "lucide-react";
import CustomSelect from "../components/CustomSelect";
import RippleButton from "../components/RippleButton";
import { codRemittanceData } from "../data/OrderData";
import { useFormik } from "formik";
import * as Yup from "yup";
import AdjustModal from "../components/AdjustModal";
import { FormModal } from "../components/CommonModal";
import { useNavigate } from "react-router-dom";

const navTabs = [
  { key: "pending", label: "Pending COD Payments" },
  { key: "paid", label: "Paid COD Payments" },
  { key: "upcoming", label: "Upcoming COD" },
];

const SuperAdminCodeRemittance = () => {
  const [tableData, setTableData] = useState(codRemittanceData);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedAdjustRow, setSelectedAdjustRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = tableData.filter(
      (item) =>
        item.status === activeTab &&
        (item.merchant || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, activeTab, tableData]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const formik = useFormik({
    initialValues: {
      merchant: "",
      netPayable: "",
      transactionId: "",
      date: new Date().toISOString().split("T")[0],
    },
    validationSchema: Yup.object({
      transactionId: Yup.string()
        .required("Transaction ID is required")
        .min(5, "Transaction ID must be at least 5 characters")
        .max(20, "Transaction ID must be at most 20 characters")
        .matches(
          /^[A-Z0-9]{10}$/,
          "Invalid Transaction ID format (e.g., ABC123DEF4)"
        ),
    }),

    onSubmit: (values) => {
      if (selectedRow) {
        const updatedItem = {
          ...selectedRow,
          status: "paid",
          netPaidAmount: values.netPayable,
          paymentDate: values.date,
          transactionId: values.transactionId,
          processedBy: "Super Admin",
        };

        const updatedData = [
          updatedItem,
          ...tableData.filter((item) => item !== selectedRow),
        ];

        setTableData(updatedData);
        setShowPaymentModal(false);
      }
    },
  });

  const handlePayClick = (row) => {
    const cleanAmount =
      parseFloat(String(row.netPayable || "0").replace(/[^0-9.-]+/g, "")) || 0;

    setSelectedRow(row);

    formik.setValues({
      merchant: row.merchant || "",
      netPayable: `₹${cleanAmount.toLocaleString("en-IN")}`,
      transactionId: "",
      date: new Date().toISOString().split("T")[0],
    });

    setShowPaymentModal(true);
  };

  const formatAmount = (num) => {
    if (Number.isInteger(num)) {
      return `₹${num.toString()}`;
    } else {
      return `₹${num.toFixed(2)}`;
    }
  };

  const handleAdjustSubmit = (values) => {
    if (!selectedAdjustRow) return;

    const grossCod = parseAmount(selectedAdjustRow.grossCod);
    const shippingCharges = parseAmount(selectedAdjustRow.shippingCharges);

    const newAdjustmentTotal = Number(values.amount);

    const newNetPayable = grossCod - shippingCharges + newAdjustmentTotal;

    const updatedRow = {
      ...selectedAdjustRow,
      adjustments: formatAmount(newAdjustmentTotal),
      netPayable: formatAmount(newNetPayable),
    };

    setTableData((prevData) =>
      prevData.map((item) => (item === selectedAdjustRow ? updatedRow : item))
    );

    setShowAdjustModal(false);
  };

  const adjustFormik = useFormik({
    initialValues: {
      merchant: "",
      amount: "",
      reason: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Amount is required")
        .typeError("Amount must be a number"),
      reason: Yup.string().required("Reason is required"),
    }),
    onSubmit: handleAdjustSubmit,
  });

  const parseAmount = (str) => {
    if (!str) return 0;
    return parseFloat(str.replace(/[^0-9.-]+/g, "")) || 0;
  };

  const handleAdjustClick = (item) => {
    setSelectedAdjustRow(item);

    adjustFormik.resetForm({
      values: {
        merchant: item.merchant || "",
        amount: parseAmount(item.adjustments),
        reason: "",
      },
    });

    setShowAdjustModal(true);
  };
  const makeSlug = (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // space → -
      .replace(/[^a-z0-9-]/g, ""); // special chars hatao
  };

  const handleViewClick = (item, source) => {
    const merchantSlug = makeSlug(item.merchant);
    navigate(`/super-admin/cod-remittance/${merchantSlug}`, {
      state: { rowData: item, source },
    });
  };

  return (
    <>
      <div className="shipment_section shipping_charge_section">
        <div className="page_header">
          <h1>COD Remittance</h1>
        </div>

        <div className="orders_container">
          <input
            type="text"
            placeholder="Search by merchant name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search_input"
          />

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
                      {
                        tableData.filter((item) => item.status === tab.key)
                          .length
                      }
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
                    {activeTab === "pending" && (
                      <>
                        <th>Merchant</th>
                        <th>Gross COD</th>
                        <th>Shipping Charges</th>
                        <th>Adjustments</th>
                        <th>Net Payable</th>
                        <th>Payout Cycle</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </>
                    )}
                    {activeTab === "paid" && (
                      <>
                        <th>Merchant</th>
                        <th>Net Paid Amount</th>
                        <th>Payment Date</th>
                        <th>Transaction ID</th>
                        <th>Processed By</th>
                        <th>Actions</th>
                      </>
                    )}
                    {activeTab === "upcoming" && (
                      <>
                        <th>Merchant</th>
                        <th>Gross COD</th>
                        <th>Shipping Charges</th>
                        <th>Adjustments</th>
                        <th>Net Payable</th>
                        <th>Payout Cycle</th>
                        <th>Period</th>
                      </>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {displayData.length > 0 ? (
                    displayData.map((item, index) => (
                      <tr key={index}>
                        {activeTab === "pending" && (
                          <>
                            <td style={{ textAlign: "left" }}>
                              {item.merchant}
                            </td>
                            <td
                              style={{
                                color: item.grossCod?.includes("-")
                                  ? "#ef4444"
                                  : "#16a34a",
                                fontWeight: "500",
                              }}
                            >
                              {item.grossCod}
                            </td>
                            <td
                              style={{
                                color: item.shippingCharges?.includes("-")
                                  ? "#ef4444"
                                  : "#16a34a",
                                fontWeight: "500",
                              }}
                            >
                              {item.shippingCharges}
                            </td>
                            <td
                              style={{
                                color: item.adjustments?.includes("-")
                                  ? "#ef4444"
                                  : "#16a34a",
                                fontWeight: "500",
                              }}
                            >
                              {item.adjustments}
                            </td>
                            <td
                              style={{
                                color: item.netPayable?.includes("-")
                                  ? "#ef4444"
                                  : "#16a34a",
                                fontWeight: "500",
                              }}
                            >
                              {item.netPayable}
                            </td>
                            <td>{item.payoutCycle}</td>
                            <td>
                              <span
                                className={`status_badge ${
                                  item.Status === "Paid" ? "paid" : "pending"
                                }`}
                              >
                                {item.paymentStatus}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <RippleButton
                                  className="resolve_button"
                                  onClick={() => handleViewClick(item)}
                                >
                                  <Eye size={18} />
                                  View
                                </RippleButton>
                                <RippleButton
                                  className="resolve_button pay_button"
                                  onClick={() => handlePayClick(item)}
                                >
                                  <CircleDollarSign size={18} />
                                  Pay
                                </RippleButton>

                                <RippleButton
                                  className="resolve_button adjust_button"
                                  onClick={() => handleAdjustClick(item)}
                                >
                                  <Diff size={18} />
                                  Adjust
                                </RippleButton>
                              </div>
                            </td>
                          </>
                        )}

                        {activeTab === "paid" && (
                          <>
                            <td style={{ textAlign: "left" }}>
                              {item.merchant}
                            </td>
                            <td
                              style={{
                                color: "#16a34a",
                                fontWeight: "500",
                              }}
                            >
                              {item.netPaidAmount}
                            </td>
                            <td>{item.paymentDate}</td>
                            <td>{item.transactionId}</td>
                            <td>{item.processedBy}</td>
                            <td>
                              <RippleButton
                                className="resolve_button"
                                onClick={() => handleViewClick(item, "pending")}
                              >
                                View Details
                              </RippleButton>
                            </td>
                          </>
                        )}

                        {activeTab === "upcoming" && (
                          <>
                            <td style={{ textAlign: "left" }}>
                              {item.merchant}
                            </td>
                            <td
                              style={{
                                color: item.grossCod?.includes("-")
                                  ? "#ef4444"
                                  : "#16a34a",
                                fontWeight: "500",
                              }}
                            >
                              {item.grossCod}
                            </td>
                            <td
                              style={{
                                color: item.shippingCharges?.includes("-")
                                  ? "#ef4444"
                                  : "#16a34a",
                                fontWeight: "500",
                              }}
                            >
                              {item.shippingCharges}
                            </td>
                            <td
                              style={{
                                color: item.adjustments?.includes("-")
                                  ? "#ef4444"
                                  : "#16a34a",
                                fontWeight: "500",
                              }}
                            >
                              {item.adjustments}
                            </td>
                            <td
                              style={{
                                color: item.netPayable?.includes("-")
                                  ? "#ef4444"
                                  : "#16a34a",
                                fontWeight: "500",
                              }}
                            >
                              {item.netPayable}
                            </td>
                            <td>{item.payoutCycle}</td>
                            <td>{item.period}</td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={activeTab === "paid" ? 6 : 8}
                        style={{ textAlign: "center" }}
                      >
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="pagination_container">
            <div className="pagination_info">
              <div className="page_inf">
                <span>Rows per page:</span>
                <CustomSelect
                  options={[10, 20, 50, 100]}
                  value={rowsPerPage}
                  onChange={(val) => {
                    setRowsPerPage(val);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="row_count">
                {filteredData.length === 0
                  ? "0 of 0"
                  : `${startIndex + 1}–${Math.min(
                      endIndex,
                      filteredData.length
                    )} of ${filteredData.length}`}
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
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Mark Payment as Paid"
        onSubmit={formik.handleSubmit}
        size="medium"
        submitText="Confirm Payment"
        cancelText="Cancel"
        submitButtonProps={{
          className: "resolve_button",
          disabled: !formik.isValid || !formik.dirty,
        }}
        cancelButtonProps={{
          className: "cancel_btn",
        }}
        className="mark_payment_modal"
      >
        <div className="input_main">
          <label>Store Name</label>
          <input
            type="text"
            value={formik.values.merchant}
            readOnly
            placeholder="Store Name"
          />
        </div>

        <div className="input_main">
          <label>Amount</label>
          <input
            type="text"
            value={formik.values.netPayable}
            readOnly
            placeholder="Amount"
          />
        </div>

        <div className="input_main">
          <label>
            Transaction ID <span>*</span>
          </label>
          <input
            type="text"
            placeholder="Enter bank transaction ID"
            name="transactionId"
            value={formik.values.transactionId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoFocus
          />
          {formik.touched.transactionId && formik.errors.transactionId && (
            <div className="error">{formik.errors.transactionId}</div>
          )}
        </div>

        <div className="input_main">
          <label>
            Payment Date<span>*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
          />
        </div>
      </FormModal>

      {showAdjustModal && (
        <AdjustModal
          formik={adjustFormik}
          setShowAdjustModal={setShowAdjustModal}
        />
      )}
    </>
  );
};

export default SuperAdminCodeRemittance;
