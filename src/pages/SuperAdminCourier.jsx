import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import RippleButton from "../components/RippleButton";
import CustomSelect from "../components/CustomSelect";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const columns = useMemo(
    () => [
      { label: "ID", accessor: "id" },
      { label: "Name", accessor: "name" },
      { label: "Master Company", accessor: "master_company" },
    ],
    []
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCouriers = couriers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(couriers.length / rowsPerPage);

  return (
    <div className="shipment_section super_admin_courier">
      <div className="page_header">
          <h1>Couriers</h1>
      </div>

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
                data={paginatedCouriers}
                stickyColumn={columns[0]}
              />
            </div>
          </div>
          {couriers.length === 0 && (
            <h6 className="no_data_found">No couriers found.</h6>
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
                {couriers.length === 0
                  ? "0 of 0"
                  : `${startIndex + 1}–${Math.min(
                      endIndex,
                      couriers.length
                    )} of ${couriers.length}`}
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
    </div>
  );
};

export default SuperAdminCourier;
