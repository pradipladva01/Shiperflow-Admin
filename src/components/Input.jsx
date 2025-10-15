import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  label = "",
  error = "",
  disabled = false,
  required = false,
  className = "",
  name = "",
  id = "",
  showPasswordToggle = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType =
    showPasswordToggle && type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`input_main ${className}`}>
      {label && (
        <label htmlFor={id || name} className="input_label">
          {label}
          {required && <span className="required_asterisk">*</span>}
        </label>
      )}

      <div
        className={`input_wrapper ${isFocused ? "focused" : ""} ${
          error ? "error" : ""
        } ${disabled ? "disabled" : ""}`}
      >
        <input
          type={inputType}
          id={id || name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          className="input_field"
          {...props}
        />

        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            className="password_toggle"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && <span className="input_error">{error}</span>}
    </div>
  );
};

export default Input;
