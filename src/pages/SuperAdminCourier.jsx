import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import RippleButton from "../components/RippleButton";
import CustomSelect from "../components/CustomSelect";
import Input from "../components/Input";
import { FormModal } from "../components/CommonModal";
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from "lucide-react";
import { api } from "../utils/axiosUtils";
import { toast } from "react-toastify";

const SuperAdminCourier = () => {
  const [couriers, setCouriers] = useState([]);
  const [meta, setMeta] = useState({
    total_courier_count: 0,
    serviceable_pincodes_count: 0,
    pickup_pincodes_count: 0,
    total_rto_count: 0,
    total_oda_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCouriers() {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          "https://api.fixoindia.com/public/api/shiprocket/couriers"
        );

        const payload = res?.data || {};
        const list = Array.isArray(payload?.courier_data)
          ? payload.courier_data
          : [];

        if (!isMounted) return;

        setCouriers(list);
        setMeta({
          total_courier_count: payload?.total_courier_count ?? 0,
          serviceable_pincodes_count: payload?.serviceable_pincodes_count ?? 0,
          pickup_pincodes_count: payload?.pickup_pincodes_count ?? 0,
          total_rto_count: payload?.total_rto_count ?? 0,
          total_oda_count: payload?.total_oda_count ?? 0,
        });
      } catch (e) {
        if (!isMounted) return;
        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to load couriers."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCouriers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEdit = (courier) => {
    // TODO: Implement edit functionality
    console.log("Edit courier:", courier);
  };

  const handleDelete = (courier) => {
    // TODO: Implement delete functionality
    console.log("Delete courier:", courier);
  };

  const columns = useMemo(
    () => [
      { 
        label: "ID", 
        accessor: "_rowIndex",
        render: (value, row) => {
          return (row._rowIndex ?? 0) + 1;
        }
      },
      { label: "Courier ID", accessor: "id" },
      { label: "Name", accessor: "name" },
      { label: "Master Company", accessor: "master_company" },
      { label: "Change Label Name", accessor: "change_name" },
      {
        label: "Action",
        accessor: "action",
        render: (value, row) => {
          return (
              <RippleButton
                className="edit_btn"
                onClick={() => {
                  setSelectedCourier({
                    id: row.id,
                    name: row.name,
                    min_weight: row.min_weight
                  });
                  setIsModalOpen(true);
                }}
              >
                <Plus size={16} />
              </RippleButton>
          );
        }
      },
    ],
    []
  );

  // Filter couriers based on search query
  const filteredCouriers = useMemo(() => {
    if (!searchQuery.trim()) {
      return couriers;
    }
    const query = searchQuery.toLowerCase().trim();
    return couriers.filter((courier) => {
      return (
        courier.id?.toString().toLowerCase().includes(query) ||
        courier.name?.toLowerCase().includes(query) ||
        courier.master_company?.toLowerCase().includes(query)
      );
    });
  }, [couriers, searchQuery]);

  // Pagination logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCouriers = filteredCouriers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCouriers.length / rowsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Formik for Add Courier Modal
  const formik = useFormik({
    initialValues: {
      label_name: "",
    },
    validationSchema: Yup.object({
      label_name: Yup.string().required("Label Name is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      console.log("Formik onSubmit called", values, selectedCourier);
      
      if (!selectedCourier) {
        toast.error("No courier selected");
        setSubmitting(false);
        return;
      }

      try {
        const payload = {
          courier_id: selectedCourier.id.toString(),
          courier_name: selectedCourier.name,
          min_weight: selectedCourier.min_weight,
          name: values.label_name
        };

        console.log("Making API call with payload:", payload);
        const response = await api.post("/superadmin/admin-courier", payload);
        console.log("API response:", response);

        if (response.data) {
          toast.success(
            response.data?.message || "Courier added successfully!"
          );
          resetForm();
          setIsModalOpen(false);
          setSelectedCourier(null);
        }
      } catch (error) {
        console.error("Error saving courier:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to add courier. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
    formik.resetForm();
    setSelectedCourier(null);
  };

  return (
    <div className="shipment_section super_admin_courier">
      <div className="page_header">
        <h1>Couriers</h1>
      </div>

      {!loading && !error && (
        <div style={{ marginBottom: "10px" }}>
          <Input
            type="text"
            placeholder="Search by ID, Name, or Master Company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search_input"
          />
        </div>
      )}

      {loading ? (
        <div style={{ padding: 16 }}>
          <Loader />
        </div>
      ) : error ? (
        <div style={{ padding: 16, color: "#ef4444", fontWeight: 600 }}>
          {error}
        </div>
      ) : (
        <div className="orders_container">
          <div className="table-responsive">
            <div className="order_table_wrapper">
              <DataTable
                columns={columns}
                data={paginatedCouriers.map((row, index) => ({
                  ...row,
                  _rowIndex: startIndex + index,
                }))}
                stickyColumn={columns[0]}
              />
            </div>
          </div>
          {filteredCouriers.length === 0 && (
            <h6 className="no_data_found">
              {searchQuery ? "No couriers found matching your search." : "No couriers found."}
            </h6>
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
                {filteredCouriers.length === 0
                  ? "0 of 0"
                  : `${startIndex + 1}–${Math.min(
                      endIndex,
                      filteredCouriers.length
                    )} of ${filteredCouriers.length}`}
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
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Change Label Name"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Form submitted", formik.values, selectedCourier);
          formik.handleSubmit(e);
        }}
        size="medium"
        submitText="Save"
        cancelText="Cancel"
        submitButtonProps={{
          type: "button",
          disabled: formik.isSubmitting,
          onClick: async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Save button clicked", formik.values, selectedCourier);
            
            if (!selectedCourier) {
              toast.error("No courier selected");
              return;
            }

            // Validate form first
            const errors = await formik.validateForm();
            if (Object.keys(errors).length === 0) {
              // Form is valid, trigger submit
              console.log("Form is valid, calling handleSubmit");
              formik.handleSubmit();
            } else {
              // Mark all fields as touched to show errors
              console.log("Form has errors:", errors);
              formik.setTouched({
                label_name: true,
              });
            }
          },
        }}
      >
          <Input
            type="text"
            label="Label Name"
            name="label_name"
            placeholder="Enter Label Name"
            value={formik.values.label_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.label_name && formik.errors.label_name ? formik.errors.label_name : ""}
            required
          />
      </FormModal>
    </div>
  );
};

export default SuperAdminCourier;
