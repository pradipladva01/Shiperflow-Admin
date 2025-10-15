import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthContext } from "./../utils/hooks/auth/useAuthContext";
import { useLogin } from "./../utils/hooks/auth/useLogin";
import { Eye, EyeOff, Zap, ArrowRight } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useLogin();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      navigate("/super-admin/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    sessionStorage.removeItem("registrationEmail");
    sessionStorage.removeItem("registrationPassword");
  }, []);

  const formik = useFormik({
    initialValues: {
      email: sessionStorage.getItem("registrationEmail") || "",
      password: sessionStorage.getItem("registrationPassword") || "",
      remember: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      await login(values);
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

      {/* Right Panel with Login Form */}
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
            <h1>Welcome back!</h1>
            <p>Please login to your account</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="modern_login_form">
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

            <div className="form_actions">
              <div className="remember_me">
                <input
                  className="checkbox"
                  type="checkbox"
                  name="remember"
                  id="remember"
                  onChange={formik.handleChange}
                  checked={formik.values.remember}
                />
                <label className="checkbox_label" htmlFor="remember">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="forgot_link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="continue_btn" disabled={isLoading}>
              {isLoading ? (
                "Signing In..."
              ) : (
                <>
                  Login to Shiperflow
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="login_footer">
            <span>Don't have an account yet?</span>
            <Link to="/admin/register" className="login_link">
              Create a Shiperflow account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
