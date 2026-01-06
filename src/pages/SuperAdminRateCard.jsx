import React, { useState } from "react";
import RippleButton from "../components/RippleButton";

const pricingData = [
  // Xpressbees New 500 gm
  {
    courier: "Xpressbees New 500 gm",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Xpressbees New 500 gm",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Xpressbees New 500 gm",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Xpressbees New 1 K.G
  {
    courier: "Xpressbees New 1 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Xpressbees New 1 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Xpressbees New 1 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Xpressbees New 2 K.G
  {
    courier: "Xpressbees New 2 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Xpressbees New 2 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Xpressbees New 2 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Ekart Surface 500 gm
  {
    courier: "Ekart Surface 500 gm",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Ekart Surface 500 gm",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Ekart Surface 500 gm",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Ekart Surface 1 K.G
  {
    courier: "Ekart Surface 1 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Ekart Surface 1 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Ekart Surface 1 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Ekart Surface 2 K.G
  {
    courier: "Ekart Surface 2 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Ekart Surface 2 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Ekart Surface 2 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Delhivery Surface (Brand) 500 gm
  {
    courier: "Delhivery Surface (Brand) 500 gm",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Surface (Brand) 500 gm",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Surface (Brand) 500 gm",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Delhivery Surface (Brand) 1 K.G
  {
    courier: "Delhivery Surface (Brand) 1 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Surface (Brand) 1 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Surface (Brand) 1 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Delhivery Surface (Brand) 2 K.G
  {
    courier: "Delhivery Surface (Brand) 2 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Surface (Brand) 2 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Surface (Brand) 2 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Delhivery Lite 500 gm
  {
    courier: "Delhivery Lite 500 gm",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Lite 500 gm",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Lite 500 gm",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Delhivery Lite 1 K.G
  {
    courier: "Delhivery Lite 1 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Lite 1 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Lite 1 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
  // Delhivery Lite 2 K.G
  {
    courier: "Delhivery Lite 2 K.G",
    type: "FWD",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Lite 2 K.G",
    type: "RTO",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: 50,
    codPercent: 2,
  },
  {
    courier: "Delhivery Lite 2 K.G",
    type: "Add Wt",
    withinCity: 10,
    withinState: 10,
    regional: 10,
    metroToMetro: 10,
    neJkKlAn: 10,
    restOfIndia: 10,
    codCharges: 50,
    codPercent: 2,
  },
];

const SuperAdminRateCard = () => {
  const [activeTab, setActiveTab] = useState("Custom");
  const [data, setData] = useState(pricingData);
  const [editingCell, setEditingCell] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());

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

  // Get all row indices for a given courier name
  const getCourierRowIndices = (courierName) => {
    return data
      .map((item, index) => (item.courier === courierName ? index : null))
      .filter((index) => index !== null);
  };

  // Check if this is the first row for a courier (where checkbox should appear)
  const isFirstRowForCourier = (rowIndex) => {
    const courierName = data[rowIndex].courier;
    const courierIndices = getCourierRowIndices(courierName);
    return courierIndices[0] === rowIndex;
  };

  // Check if all rows for a courier are selected
  const areAllCourierRowsSelected = (courierName) => {
    const courierIndices = getCourierRowIndices(courierName);
    return courierIndices.every((index) => selectedRows.has(index));
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
            <div className="tab_selector">
              <button
                className={`tab_button ${
                  activeTab === "Custom" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Custom")}
              >
                Custom (Active)
              </button>
            </div>
          </div>

          <div className="pricing_table_container">
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
                  <tr key={index}>
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
                    <td>{item.courier}</td>
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
                      {renderEditableCell(index, "codCharges", item.codCharges)}
                    </td>
                    <td>
                      {renderEditableCell(index, "codPercent", item.codPercent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminRateCard;
