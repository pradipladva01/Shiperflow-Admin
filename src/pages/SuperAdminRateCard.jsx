import React, { useState } from "react";
import Select from "react-select";
import RippleButton from "../components/RippleButton";


const SuperAdminRateCard = () => {
  const [data, setData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [draggedRowIndex, setDraggedRowIndex] = useState(null);
  const [dragOverRowIndex, setDragOverRowIndex] = useState(null);

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
  const getFilteredCourierOptions = (weight = selectedWeight) => {
    const existingCombinations = getExistingCombinations();
    return courierOptions.filter((courier) => {
      if (!weight) return true;
      const combination = `${courier.value}|${weight.value}`;
      return !existingCombinations.has(combination);
    });
  };

  // Get filtered weight options based on selected courier
  const getFilteredWeightOptions = (courier = selectedCourier) => {
    const existingCombinations = getExistingCombinations();
    return weightOptions.filter((weight) => {
      if (!courier) return true;
      const combination = `${courier.value}|${weight.value}`;
      return !existingCombinations.has(combination);
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourier(null);
    setSelectedWeight(null);
  };

  // Get base courier name (without weight suffix)
  const getBaseCourierName = (courierName) => {
    if (!courierName || courierName === "-") return null;
    const weightValues = weightOptions.map((w) => w.value);
    let baseCourier = courierName;
    for (const weight of weightValues) {
      if (baseCourier.endsWith(` ${weight}`)) {
        baseCourier = baseCourier.replace(` ${weight}`, "").trim();
        break;
      }
    }
    return baseCourier;
  };
  
  const getWeightOrder = (weight) => {
    const order = weightOptions.findIndex((w) => w.value === weight);
    return order === -1 ? 999 : order; 
  };

  const findInsertionIndex = (baseCourierName, newWeight) => {
    const newWeightOrder = getWeightOrder(newWeight);
    
    // Find all entries for the same base courier
    const sameCourierEntries = [];
    data.forEach((item, index) => {
      if (item.courier !== "-") {
        const itemBaseCourier = getBaseCourierName(item.courier);
        if (itemBaseCourier === baseCourierName) {
          const itemWeight = item.weight;
          const itemWeightOrder = getWeightOrder(itemWeight);
          sameCourierEntries.push({
            index,
            weight: itemWeight,
            weightOrder: itemWeightOrder,
          });
        }
      }
    });

    // If no existing entries for this courier, return -1 to append at end
    if (sameCourierEntries.length === 0) {
      return -1;
    }

    // Sort by weight order
    sameCourierEntries.sort((a, b) => a.weightOrder - b.weightOrder);

    // Find where to insert based on weight order
    for (let i = 0; i < sameCourierEntries.length; i++) {
      if (newWeightOrder < sameCourierEntries[i].weightOrder) {
        // Insert before this entry
        const targetEntry = sameCourierEntries[i];
        const courierIndices = getCourierRowIndices(data[targetEntry.index].courier);
        return courierIndices[0]; // Return the first index of the target courier group
      }
    }

    // If new weight is greater than all existing, insert after the last one
    const lastEntry = sameCourierEntries[sameCourierEntries.length - 1];
    const lastCourierIndices = getCourierRowIndices(data[lastEntry.index].courier);
    return Math.max(...lastCourierIndices) + 1; // Insert after the last row of the last courier group
  };

  const handleAddCourier = () => {
    if (!selectedCourier || !selectedWeight) {
      alert("Please select both courier and weight");
      return;
    }

    // Check if this combination already exists
    const courierName = `${selectedCourier.value} ${selectedWeight.value}`;
    if (combinationExists(selectedCourier.value, selectedWeight.value)) {
      alert("This courier and weight combination already exists!");
      return;
    }
    
    const newRows = [
      {
        courier: courierName,
        weight: selectedWeight.value,
        type: "FWD",
        withinCity: 0,
        withinState: 0,
        regional: 0,
        metroToMetro: 0,
        neJkKlAn: 0,
        restOfIndia: 0,
        codCharges: "",
        codPercent: "",
      },
      {
        courier: "-",
        weight: selectedWeight.value,
        type: "RTO",
        withinCity: 0,
        withinState: 0,
        regional: 0,
        metroToMetro: 0,
        neJkKlAn: 0,
        restOfIndia: 0,
        codCharges: 0,
        codPercent: 0,
      },
      {
        courier: "-",
        weight: selectedWeight.value,
        type: "Add Wt",
        withinCity: 0,
        withinState: 0,
        regional: 0,
        metroToMetro: 0,
        neJkKlAn: 0,
        restOfIndia: 0,
        codCharges: "",
        codPercent: "",
      },
    ];

    // Format data for backend - COURIER, COD CHARGES, COD % ek hi baar
    const backendData = {
      courier: courierName,
      weight: selectedWeight.value,
      codCharges: 0,
      codPercent: 0,
      types: [
        {
          type: "FWD",
          withinCity: 0,
          withinState: 0,
          regional: 0,
          metroToMetro: 0,
          neJkKlAn: 0,
          restOfIndia: 0,
        },
        {
          type: "RTO",
          withinCity: 0,
          withinState: 0,
          regional: 0,
          metroToMetro: 0,
          neJkKlAn: 0,
          restOfIndia: 0,
        },
        {
          type: "Add Wt",
          withinCity: 0,
          withinState: 0,
          regional: 0,
          metroToMetro: 0,
          neJkKlAn: 0,
          restOfIndia: 0,
        },
      ],
    };

    // Console log array of objects for backend
    console.log("📦 Add Courier - Backend Data Structure:", backendData);

    // Find the correct insertion index based on weight sequence
    const baseCourierName = selectedCourier.value;
    const insertIndex = findInsertionIndex(baseCourierName, selectedWeight.value);

    let newData;
    if (insertIndex === -1) {
      // No existing entry for this courier, append to the end
      newData = [...data, ...newRows];
    } else {
      // Insert at the correct position based on weight sequence
      newData = [...data];
      newData.splice(insertIndex, 0, ...newRows);
    }

    setData(newData);
    handleCloseModal();
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
      "withinCity",
      "withinState",
      "regional",
      "metroToMetro",
      "neJkKlAn",
      "restOfIndia",
      "codCharges",
    ];

    if (numericFields.includes(field)) {
      // If it's "-" or empty, keep it as "-"
      if (cleanValue === "-" || cleanValue === "") {
        cleanValue = "-";
      } else {
        // Try to convert to number
        const numValue = parseFloat(cleanValue);
        cleanValue = isNaN(numValue) ? cleanValue : numValue;
      }
    }

    // For codPercent, store as string without % (will be formatted on blur)
    if (field === "codPercent") {
      cleanValue = cleanValue === "" ? "" : cleanValue;
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
        newData[rowIndex][field] = "-";
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
      "withinCity",
      "withinState",
      "regional",
      "metroToMetro",
      "neJkKlAn",
      "restOfIndia",
      "codCharges",
    ];

    if (isEditing) {
      // Get raw value for input (without symbols)
      let inputValue =
        typeof value === "number"
          ? value.toString()
          : value === "-"
          ? ""
          : value;

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

    // For display, format the value
    const displayValue =
      field === "codCharges" && value === "-"
        ? "-"
        : field === "codCharges" && value !== "-"
        ? `₹${value}`
        : field === "codPercent" && value === "-"
        ? "-"
        : field === "codPercent"
        ? `${String(value).replace(/%/g, "")}%`
        : typeof value === "number"
        ? `₹${value}`
        : value;

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
            {data.length === 0 ? (
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
                    <th>WITHIN CITY</th>
                    <th>WITHIN STATE</th>
                    <th>REGIONAL</th>
                    <th>METRO TO METRO</th>
                    <th>NE, J&K, KL, AN</th>
                    <th>REST OF INDIA</th>
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
                            .toLowerCase()
                            .replace(" ", "_")}`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td>
                        {renderEditableCell(index, "withinCity", item.withinCity)}
                      </td>
                      <td>
                        {renderEditableCell(
                          index,
                          "withinState",
                          item.withinState
                        )}
                      </td>
                      <td>
                        {renderEditableCell(index, "regional", item.regional)}
                      </td>
                      <td>
                        {renderEditableCell(
                          index,
                          "metroToMetro",
                          item.metroToMetro
                        )}
                      </td>
                      <td>
                        {renderEditableCell(index, "neJkKlAn", item.neJkKlAn)}
                      </td>
                      <td>
                        {renderEditableCell(
                          index,
                          "restOfIndia",
                          item.restOfIndia
                        )}
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
                  value={selectedCourier}
                  onChange={(selectedOption) => {
                    setSelectedCourier(selectedOption);
                    // Reset weight if the selected courier doesn't have any available weights or current weight is not available
                    if (selectedOption && selectedWeight) {
                      const availableWeights = getFilteredWeightOptions(selectedOption);
                      if (availableWeights.length === 0 || !availableWeights.find(w => w.value === selectedWeight.value)) {
                        setSelectedWeight(null);
                      }
                    } else if (!selectedOption) {
                      setSelectedWeight(null);
                    }
                  }}
                  placeholder="Select Courier"
                  className="option_select"
                  isClearable
                />
              </div>
              <div className="form_group">
                <label>Weight:</label>
                <Select
                  options={getFilteredWeightOptions()}
                  value={selectedWeight}
                  onChange={(selectedOption) => {
                    setSelectedWeight(selectedOption);
                    // Reset courier if the selected weight doesn't have any available couriers or current courier is not available
                    if (selectedOption && selectedCourier) {
                      const availableCouriers = getFilteredCourierOptions(selectedOption);
                      if (availableCouriers.length === 0 || !availableCouriers.find(c => c.value === selectedCourier.value)) {
                        setSelectedCourier(null);
                      }
                    } else if (!selectedOption) {
                      setSelectedCourier(null);
                    }
                  }}
                  placeholder="Select Weight"
                  className="option_select"
                  isClearable
                />
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
                onClick={handleAddCourier}
              >
                Add Courier
              </RippleButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuperAdminRateCard;
