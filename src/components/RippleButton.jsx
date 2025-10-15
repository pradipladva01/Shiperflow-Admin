import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const RippleButton = ({
  children,
  onClick,
  type,
  className = "",
  to,
  ...props
}) => {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = button.offsetWidth;

    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      key: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);

    if (to) {
      navigate(to); // 🔁 navigate to route
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      {...props}
      ref={buttonRef}
      className={`ripple-button ${className}`}
      onClick={handleClick}
      type={type}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      {children}
    </button>
  );
};

export default RippleButton;
