import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import RippleButton from "../components/RippleButton";
import { api, handleError } from "../utils/axiosUtils";
import { toast } from "react-toastify";
import Loader from "../components/Loader";


const SuperAdminRateCard = () => {
  const [data, setData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedRowIndex, setDraggedRowIndex] = useState(null);
  const [dragOverRowIndex, setDragOverRowIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Formik form for Add Courier Modal
  const formik = useFormik({
    initialValues: {
      courier: null,
      weight: null,
    },
    validationSchema: Yup.object({
      courier: Yup.object()
        .nullable()
        .required("Please select a courier"),
      weight: Yup.object()
        .nullable()
        .required("Please select a weight"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const selectedCourier = values.courier;
      const selectedWeight = values.weight;
      
      if (!selectedCourier || !selectedWeight) {
        return;
      }

      // Check if this combination already exists
      const courierName = `${selectedCourier.value} ${selectedWeight.value}`;
      if (combinationExists(selectedCourier.value, selectedWeight.value)) {
        toast.error("This courier and weight combination already exists!");
        return;
      }

      setIsSubmitting(true);

      // Format data for backend - COURIER, COD CHARGES, COD % ek hi baar
      const backendData = {
        courier: courierName,
        weight: selectedWeight.value,
        codCharges: 0,
        codPercent: 0,
        types: [
          {
            type: "FWD",
            zoneA: 0,
            zoneB: 0,
            zoneC: 0,
            zoneD: 0,
            zoneE: 0,
          },
          {
            type: "RTO",
            zoneA: 0,
            zoneB: 0,
            zoneC: 0,
            zoneD: 0,
            zoneE: 0,
          },
          {
            type: "Add Wt",
            zoneA: 0,
            zoneB: 0,
            zoneC: 0,
            zoneD: 0,
            zoneE: 0,
          },
        ],
      };

      try {
        // API call to add courier
        const response = await api.post("/superadmin/rate-card", backendData);

        if (response.data) {
          toast.success(
            response.data?.message || "Courier added successfully!"
          );

          await fetchRateCardData();
          
          setIsModalOpen(false);
          resetForm();
        }
      } catch (error) {
        console.error("Error adding courier:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to add courier. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  // Function to fetch rate card data
  const fetchRateCardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/superadmin/rate-card");

      if (response.data) {
        const apiData = response.data.data || response.data;
        
        let rawData = [];
        if (Array.isArray(apiData)) {
          rawData = apiData;
        } else if (apiData && Array.isArray(apiData.rateCards)) {
          rawData = apiData.rateCards;
        } else if (apiData && Array.isArray(apiData.items)) {
          rawData = apiData.items;
        }

        // Transform data: flatten types array into separate rows
        const transformedData = [];
        rawData.forEach((item) => {
          if (item.types && Array.isArray(item.types)) {
            // Create 3 rows from the types array
            item.types.forEach((typeObj, index) => {
              const toNumberOrZero = (v) => {
                if (v === "-" || v === "" || v === null || v === undefined) return 0;
                const n =
                  typeof v === "number"
                    ? v
                    : parseFloat(String(v).replace(/[₹,%\s]/g, ""));
                return Number.isFinite(n) ? n : 0;
              };

              transformedData.push({
                id: item.id,
                courier: index === 0 ? item.courier : "-", // Only first row shows courier name
                weight: item.weight,
                type: typeObj.type,
                // Support new API fields (zoneA..zoneE) with fallback to legacy keys
                zoneA: toNumberOrZero(typeObj.zoneA ?? typeObj.withinCity),
                zoneB: toNumberOrZero(typeObj.zoneB ?? typeObj.withinState),
                zoneC: toNumberOrZero(typeObj.zoneC ?? typeObj.regional),
                zoneD: toNumberOrZero(typeObj.zoneD ?? typeObj.metroToMetro),
                zoneE: toNumberOrZero(
                  typeObj.zoneE ?? typeObj.neJkKlAn ?? typeObj.restOfIndia
                ),
                codCharges:
                  typeObj.type === "RTO"
                    ? toNumberOrZero(item.cod_charges ?? item.codCharges)
                    : undefined,
                codPercent:
                  typeObj.type === "RTO"
                    ? toNumberOrZero(item.cod_percent ?? item.codPercent)
                    : undefined,
              });
            });
          }
        });

        setData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching rate card data:", error);
      const errorData = handleError(error);
      toast.error(
        errorData.message || "Failed to fetch rate card data. Please try again."
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch rate card data on component mount
  useEffect(() => {
    fetchRateCardData();
  }, []);

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

  // Get all existing courier+weight combinations
  const getExistingCombinations = () => {
    const combinations = new Set();
    data.forEach((item) => {
      if (item.courier !== "-" && item.courier && item.weight) {
        const weightValues = weightOptions.map((w) => w.value);
        let baseCourier = item.courier;
        for (const weight of weightValues) {
          if (baseCourier.endsWith(` ${weight}`)) {
            baseCourier = baseCourier.replace(` ${weight}`, "").trim();
            break;
          }
        }
        const combination = `${baseCourier}|${item.weight}`;
        combinations.add(combination);
      }
    });
    return combinations;
  };

  // Check if a combination already exists
  const combinationExists = (courier, weight) => {
    const existingCombinations = getExistingCombinations();
    const combination = `${courier}|${weight}`;
    return existingCombinations.has(combination);
  };

  // Get filtered courier options based on selected weight
  const getFilteredCourierOptions = (weight = formik.values.weight) => {
    const existingCombinations = getExistingCombinations();
    return courierOptions.filter((courier) => {
      if (!weight) return true;
      const combination = `${courier.value}|${weight.value}`;
      return !existingCombinations.has(combination);
    });
  };

  // Get filtered weight options based on selected courier
  const getFilteredWeightOptions = (courier = formik.values.courier) => {
    const existingCombinations = getExistingCombinations();
    return weightOptions.filter((weight) => {
      if (!courier) return true;
      const combination = `${courier.value}|${weight.value}`;
      return !existingCombinations.has(combination);
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (formik) {
      formik.resetForm();
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
      "zoneA",
      "zoneB",
      "zoneC",
      "zoneD",
      "zoneE",
      "codCharges",
    ];

    if (numericFields.includes(field)) {
      // If empty, default to 0
      if (cleanValue === "-" || cleanValue === "") {
        cleanValue = 0;
      } else {
        // Try to convert to number
        const numValue = parseFloat(cleanValue);
        cleanValue = isNaN(numValue) ? 0 : numValue;
      }
    }

    // For codPercent, store as string without % (will be formatted on blur)
    if (field === "codPercent") {
      cleanValue = cleanValue === "" || cleanValue === "-" ? 0 : cleanValue;
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
        newData[rowIndex][field] = "0%";
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

  // Get all row indices for a given courier name (includes all 3 rows: FWD, RTO, Add Wt)
  const getCourierRowIndices = (courierName) => {
    const indices = [];
    data.forEach((item, index) => {
      if (item.courier === courierName) {
        // Found the first row (FWD), add it and the next 2 rows (RTO, Add Wt)
        indices.push(index);
        if (index + 1 < data.length && data[index + 1].courier === "-" && data[index + 1].weight === item.weight) {
          indices.push(index + 1);
        }
        if (index + 2 < data.length && data[index + 2].courier === "-" && data[index + 2].weight === item.weight) {
          indices.push(index + 2);
        }
      }
    });
    return indices;
  };

  // Check if this is the first row for a courier (where checkbox should appear)
  const isFirstRowForCourier = (rowIndex) => {
    const courierName = data[rowIndex].courier;
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

  // Check if a row index is part of a courier group (all 3 rows)
  const isRowPartOfCourierGroup = (rowIndex, courierName) => {
    if (!courierName) return false;
    const courierIndices = getCourierRowIndices(courierName);
    return courierIndices.includes(rowIndex);
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

  // Drag and Drop handlers
  const handleDragStart = (e, rowIndex) => {
    // Only allow dragging from the first row (FWD) of each courier
    if (!isFirstRowForCourier(rowIndex)) {
      e.preventDefault();
      return;
    }
    setDraggedRowIndex(rowIndex);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", rowIndex);
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    setDraggedRowIndex(null);
    setDragOverRowIndex(null);
  };

  const handleDragOver = (e, rowIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    // Only allow dropping on the first row (FWD) of each courier
    if (isFirstRowForCourier(rowIndex)) {
      setDragOverRowIndex(rowIndex);
    }
  };

  const handleDragLeave = (e) => {
    setDragOverRowIndex(null);
  };

  const handleDrop = (e, dropRowIndex) => {
    e.preventDefault();
    setDragOverRowIndex(null);

    if (draggedRowIndex === null || draggedRowIndex === dropRowIndex) {
      return;
    }

    // Only allow dropping on the first row (FWD) of each courier
    if (!isFirstRowForCourier(dropRowIndex)) {
      return;
    }

    // Get the courier name for the dragged row
    const draggedCourierName = data[draggedRowIndex].courier;

    // Get all indices for the dragged courier (should be 3 rows: FWD, RTO, Add Wt)
    const draggedCourierIndices = getCourierRowIndices(draggedCourierName);
    
    // Extract the rows to move
    const draggedRows = draggedCourierIndices.map((idx) => data[idx]);

    // Create new data array without the dragged rows
    const newData = data.filter((_, index) => !draggedCourierIndices.includes(index));

    // Calculate new drop position in the filtered array
    let newDropIndex = dropRowIndex;
    
    // Count how many rows before dropRowIndex were removed
    const removedBeforeDrop = draggedCourierIndices.filter(idx => idx < dropRowIndex).length;
    
    // Adjust the drop index
    if (draggedRowIndex < dropRowIndex) {
      // If dragging down, adjust for removed rows
      newDropIndex = dropRowIndex - removedBeforeDrop;
    } else {
      // If dragging up, just use the adjusted index
      newDropIndex = dropRowIndex - removedBeforeDrop;
    }

    // Insert dragged rows at new position
    newData.splice(newDropIndex, 0, ...draggedRows);

    setData(newData);
    setDraggedRowIndex(null);
  };

  const renderEditableCell = (rowIndex, field, value) => {
    const cellKey = `${rowIndex}-${field}`;
    const isEditing = editingCell === cellKey;

    // Price fields that need ₹ prefix
    const priceFields = [
      "zoneA",
      "zoneB",
      "zoneC",
      "zoneD",
      "zoneE",
      "codCharges",
    ];

    if (isEditing) {
      // Get raw value for input (without symbols)
      let inputValue =
        typeof value === "number"
          ? value.toString()
          : value === "-" || value === null || value === undefined
          ? ""
          : String(value);

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

    // For display, format the value - FIXED: Show ₹0 for zero values
    const displayValue =
      field === "codCharges"
        ? value === "-" || value === null || value === undefined ? "-" : `₹${value}`
        : field === "codPercent"
        ? value === "-" || value === null || value === undefined ? "-" : `${String(value || "").replace(/%/g, "")}%`
        : priceFields.includes(field)
        ? value === "-" || value === null || value === undefined ? "-" : `₹${value}`
        : value === null || value === undefined ? "" : value;

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
    <>
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
            {loading ? (
              <Loader />
            ) : data.length === 0 ? (
              <div className="no_data_found">
                <h6>No Data Available</h6>
                <p>Click "Add Courier" to add your first rate card entry.</p>
              </div>
            ) : (
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
                    <th>ZONE A</th>
                    <th>ZONE B</th>
                    <th>ZONE C</th>
                    <th>ZONE D</th>
                    <th>ZONE E</th>
                    <th>COD CHARGES</th>
                    <th>COD %</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      draggable={isFirstRowForCourier(index)}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      className={
                        (() => {
                          // Check if this row is part of the dragged courier group (all 3 rows)
                          if (draggedRowIndex !== null) {
                            const draggedCourierName = data[draggedRowIndex]?.courier;
                            if (isRowPartOfCourierGroup(index, draggedCourierName)) {
                              return "dragging";
                            }
                          }
                          // Check if this row is part of the drag-over courier group (all 3 rows)
                          if (dragOverRowIndex !== null) {
                            const dragOverCourierName = data[dragOverRowIndex]?.courier;
                            if (isRowPartOfCourierGroup(index, dragOverCourierName)) {
                              return "drag-over";
                            }
                          }
                          return "";
                        })()
                      }
                    >
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
                      <td>
                        {isFirstRowForCourier(index) ? (
                          <div
                            className="drag_handle"
                            onMouseDown={(e) => e.stopPropagation()}
                            title="Drag to reorder"
                          >
                            <svg
                              width="12"
                              height="16"
                              viewBox="0 0 12 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="2" cy="3" r="1.5" fill="currentColor" />
                              <circle cx="2" cy="8" r="1.5" fill="currentColor" />
                              <circle cx="2" cy="13" r="1.5" fill="currentColor" />
                              <circle cx="6" cy="3" r="1.5" fill="currentColor" />
                              <circle cx="6" cy="8" r="1.5" fill="currentColor" />
                              <circle cx="6" cy="13" r="1.5" fill="currentColor" />
                            </svg>
                          </div>
                        ) : (
                          <span></span>
                        )}
                      </td>
                      <td>{item.courier === "-" ? "" : item.courier}</td>
                      <td>{item?.weight}</td>
                      <td>
                        <span
                          className={`type_badge ${item.type
                            ?.toLowerCase()
                            .replace(" ", "_") || ""}`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td>
                        {renderEditableCell(index, "zoneA", item.zoneA)}
                      </td>
                      <td>
                        {renderEditableCell(
                          index,
                          "zoneB",
                          item.zoneB
                        )}
                      </td>
                      <td>
                        {renderEditableCell(index, "zoneC", item.zoneC)}
                      </td>
                      <td>
                        {renderEditableCell(
                          index,
                          "zoneD",
                          item.zoneD
                        )}
                      </td>
                      <td>
                        {renderEditableCell(index, "zoneE", item.zoneE)}
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
            )}
          </div>
        </div>
      </div>

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
                  options={getFilteredCourierOptions()}
                  value={formik.values.courier}
                  onChange={(selectedOption) => {
                    formik.setFieldValue("courier", selectedOption);
                    // Reset weight if the selected courier doesn't have any available weights or current weight is not available
                    if (selectedOption && formik.values.weight) {
                      const availableWeights = getFilteredWeightOptions(selectedOption);
                      if (availableWeights.length === 0 || !availableWeights.find(w => w.value === formik.values.weight.value)) {
                        formik.setFieldValue("weight", null);
                      }
                    } else if (!selectedOption) {
                      formik.setFieldValue("weight", null);
                    }
                  }}
                  onBlur={() => formik.setFieldTouched("courier", true)}
                  placeholder="Select Courier"
                  className="option_select"
                  isClearable
                />
                {formik.touched.courier && formik.errors.courier && (
                  <div className="error" style={{ color: "#dc3545", fontSize: "14px", marginTop: "5px" }}>
                    {formik.errors.courier}
                  </div>
                )}
              </div>
              <div className="form_group">
                <label>Weight:</label>
                <Select
                  options={getFilteredWeightOptions()}
                  value={formik.values.weight}
                  onChange={(selectedOption) => {
                    formik.setFieldValue("weight", selectedOption);
                    if (selectedOption && formik.values.courier) {
                      const availableCouriers = getFilteredCourierOptions(selectedOption);
                      if (availableCouriers.length === 0 || !availableCouriers.find(c => c.value === formik.values.courier.value)) {
                        formik.setFieldValue("courier", null);
                      }
                    } else if (!selectedOption) {
                      formik.setFieldValue("courier", null);
                    }
                  }}
                  onBlur={() => formik.setFieldTouched("weight", true)}
                  placeholder="Select Weight"
                  className="option_select"
                  isClearable
                />
                {formik.touched.weight && formik.errors.weight && (
                  <div className="error" style={{ color: "#dc3545", fontSize: "14px", marginTop: "5px" }}>
                    {formik.errors.weight}
                  </div>
                )}
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
                onClick={() => {
                  formik.setTouched({
                    courier: true,
                    weight: true,
                  });
                  formik.handleSubmit();
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Courier"}
              </RippleButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuperAdminRateCard;
