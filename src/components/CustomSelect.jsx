// CustomSelect.js
import { ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const CustomSelect = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  const handleClickOutside = (e) => {
    if (selectRef.current && !selectRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-select" ref={selectRef}>
      <div className="selected-value" onClick={() => setOpen(!open)}>
        {value}{" "}
        <span className="arrow">
          <ChevronDown />
        </span>
      </div>
      {open && (
        <ul className="select-options">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={option === value ? "active" : ""}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
