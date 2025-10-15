import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRegister } from "./../utils/hooks/auth/useRegister";
import { Eye, EyeOff, Zap, ArrowRight } from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useRegister();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
        .required("Password is required"),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Password confirmation is required"),
    }),
    onSubmit: async (values) => {
      // Save email and password to sessionStorage before registration
      sessionStorage.setItem("registrationEmail", values.email);
      sessionStorage.setItem("registrationPassword", values.password);

      await register(values);
    },
  });

  return (
    <div className="modern_login_container">
      {/* Left Panel with 3D Elements and Cards */}
      <div className="login_left_panel">
        <div className="decorative_shapes">
          <div className="welcome_text">SHIPERFLOW</div>
          <div className="subtitle">Your Logistics Partner</div>
        </div>
      </div>

      {/* Right Panel with Register Form */}
      <div className="login_right_panel">
        <div className="login_content">
          <div className="login_header">
            <div className="brand_name">
              <div className="shiperflow_icon">
                <Zap size={24} />
              </div>
              SHIPERFLOW
            </div>
          </div>

          <div className="welcome_title">
            <h1>Create Account!</h1>
            <p>Please fill in your details to get started</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="modern_login_form">
            <div className="form_group">
              <label htmlFor="name" className="form_label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form_input"
                placeholder="Enter your full name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="error_message">{formik.errors.name}</div>
              )}
            </div>

            <div className="form_group">
              <label htmlFor="email" className="form_label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form_input"
                placeholder="jabber@gmail.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="error_message">{formik.errors.email}</div>
              )}
            </div>

            <div className="form_group">
              <label htmlFor="phone" className="form_label">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="form_input"
                placeholder="Enter your phone number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="error_message">{formik.errors.phone}</div>
              )}
            </div>

            <div className="form_group">
              <label htmlFor="password" className="form_label">
                Password
              </label>
              <div className="password_wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="form_input"
                  placeholder="********"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <button
                  type="button"
                  className="password_toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="error_message">{formik.errors.password}</div>
              )}
            </div>

            <div className="form_group">
              <label htmlFor="password_confirmation" className="form_label">
                Confirm Password
              </label>
              <div className="password_wrapper">
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  className="form_input"
                  placeholder="********"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password_confirmation}
                />
                <button
                  type="button"
                  className="password_toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {formik.touched.password_confirmation &&
                formik.errors.password_confirmation && (
                  <div className="error_message">
                    {formik.errors.password_confirmation}
                  </div>
                )}
            </div>

            <button type="submit" className="continue_btn" disabled={isLoading}>
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Shiperflow Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="login_footer">
            <span>Already have an account?</span>
            <Link to="/login" className="login_link">
              Sign in to Shiperflow
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
