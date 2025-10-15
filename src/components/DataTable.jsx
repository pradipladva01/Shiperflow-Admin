import React from "react";
import RippleButton from "./RippleButton";

const DataTable = ({
  columns = [],
  data = [],
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  isAllSelected = false,
  stickyColumn = null,
}) => {
  return (
    <div className="table_container">
      <table className="order_table">
        <thead>
          <tr>
            {onSelectRow && (
              <th>
                <RippleButton
                  className="checkbox_wrapper"
                  onClick={onSelectAll}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={isAllSelected}
                    readOnly
                  />
                </RippleButton>
              </th>
            )}
            {columns.map((col, index) => (
              <th
                key={col.accessor}
                className={
                  stickyColumn && stickyColumn.accessor === col.accessor
                    ? "sticky_column"
                    : ""
                }
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {onSelectRow && (
                <td>
                  <RippleButton
                    className="checkbox_wrapper"
                    onClick={() => onSelectRow(row.id)}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      readOnly
                    />
                  </RippleButton>
                </td>
              )}

              {columns.map((col, index) => (
                <td
                  key={col.accessor}
                  className={
                    stickyColumn && stickyColumn.accessor === col.accessor
                      ? "sticky_column"
                      : ""
                  }
                >
                  {col.render
                    ? col.render(row[col.accessor], row)
                    : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
