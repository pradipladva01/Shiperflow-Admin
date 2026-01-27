import React, { useState, useEffect } from "react";
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
import { handleError } from "../utils/axiosUtils";
import Loader from "../components/Loader";
import { api } from "../utils/axiosUtils";


const SuperAdminMerchant = () => {
  const navigate = useNavigate();
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMerchants, setSelectedMerchants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showActionDropdown, setShowActionDropdown] = useState(null);

  // Fetch merchants from API
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        setLoading(true);
        const response = await api.get("/all-merchant");
        
        if (response.data && response.data.success && response.data.data) {
          // Map API response to component format - only use fields from API
          const mappedMerchants = response.data.data.map((merchant) => ({
            id: merchant.merchant_id || merchant.id,
            merchantId: merchant.merchant_id || `MER-${merchant.id}`,
            name: merchant.name || "",
            email: merchant.email || "",
            phone: merchant.phone || "",
            lastActive: merchant.updated_at || merchant.created_at || "",
            originalId: merchant.id,
          }));
          setMerchants(mappedMerchants);
        }
      } catch (error) {
        console.error("Error fetching merchants:", error);
        const errorData = handleError(error);
        console.error("Error details:", errorData);
        // Keep empty array on error
        setMerchants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  // No filters needed - show all merchants
  const filteredMerchants = merchants;

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="shipment_section super_admin_merchant">
      <div className="page_header">
        <h1>Merchants</h1>
      </div>
      <div className="filter_controls">
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Last Active</th>
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
                    <td className="merchant_id">{merchant.merchantId}</td>
                    <td className="business_name">{merchant.name}</td>
                    <td className="email">{merchant.email}</td>
                    <td className="phone">{merchant.phone}</td>
                    <td className="last_active">
                      {merchant.lastActive ? formatDate(merchant.lastActive) : "N/A"}
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
