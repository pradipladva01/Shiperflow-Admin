import React, { useState } from "react";

const pricingData = [
  {
    courier: "Surface Xpressbees 0.5 K.G",
    type: "FWD",
    withinCity: 45,
    withinState: 45,
    regional: 45,
    metroToMetro: 45,
    neJkKlAn: 45,
    restOfIndia: 45,
    codCharges: "-",
    codPercent: "-",
  },
  {
    courier: "Surface Xpressbees 0.5 K.G",
    type: "RTO",
    withinCity: 21,
    withinState: 21,
    regional: 21,
    metroToMetro: 21,
    neJkKlAn: 21,
    restOfIndia: 21,
    codCharges: 21,
    codPercent: "1.18",
  },
  {
    courier: "Surface Xpressbees 0.5 K.G",
    type: "Add Wt.",
    withinCity: 35,
    withinState: 35,
    regional: 35,
    metroToMetro: 35,
    neJkKlAn: 35,
    restOfIndia: 35,
    codCharges: "-",
    codPercent: "-",
  },
  {
    courier: "Xpressbees 1 K.G",
    type: "FWD",
    withinCity: 65,
    withinState: 65,
    regional: 65,
    metroToMetro: 65,
    neJkKlAn: 65,
    restOfIndia: 65,
    codCharges: "-",
    codPercent: "-",
  },
  {
    courier: "Xpressbees 1 K.G",
    type: "RTO",
    withinCity: 21,
    withinState: 21,
    regional: 21,
    metroToMetro: 21,
    neJkKlAn: 21,
    restOfIndia: 21,
    codCharges: 21,
    codPercent: "1.18",
  },
  {
    courier: "Xpressbees 1 K.G",
    type: "Add Wt.",
    withinCity: 45,
    withinState: 45,
    regional: 45,
    metroToMetro: 45,
    neJkKlAn: 45,
    restOfIndia: 45,
    codCharges: "-",
    codPercent: "-",
  },
  {
    courier: "Xpressbees 2 K.G",
    type: "FWD",
    withinCity: 79,
    withinState: 79,
    regional: 79,
    metroToMetro: 79,
    neJkKlAn: 79,
    restOfIndia: 79,
    codCharges: "-",
    codPercent: "-",
  },
  {
    courier: "Xpressbees 2 K.G",
    type: "RTO",
    withinCity: 21,
    withinState: 21,
    regional: 21,
    metroToMetro: 21,
    neJkKlAn: 21,
    restOfIndia: 21,
    codCharges: 21,
    codPercent: "1.18",
  },
  {
    courier: "Xpressbees 2 K.G",
    type: "Add Wt.",
    withinCity: 30,
    withinState: 30,
    regional: 30,
    metroToMetro: 30,
    neJkKlAn: 30,
    restOfIndia: 30,
    codCharges: "-",
    codPercent: "-",
  },
];

const SuperAdminRateCard = () => {
  const [activeTab, setActiveTab] = useState("Custom");
  const [data, setData] = useState(pricingData);
  const [editingCell, setEditingCell] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);

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
