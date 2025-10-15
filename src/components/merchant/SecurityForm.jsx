import React, { useState } from "react";
import { Eye, EyeOff, Pencil, Trash2, UserRoundPlus } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import RippleButton from "../RippleButton";
import AddStaffModal from "../AddStaffModal";

const SecurityForm = () => {
  const [staffList, setStaffList] = useState([
    {
      id: 1,
      name: "Pradip Ladva",
      email: "pradip@gmail.com",
      role: { value: "manager", label: "Manager" },
      permissions: ["View Orders", "Manage Orders"],
      isActive: true,
    },
    {
      id: 2,
      name: "Ravi Kumar",
      email: "ravi@gmail.com",
      role: { value: "operator", label: "Operator" },
      permissions: ["View Orders", "Create Shipments"],
      isActive: true,
    },
    {
      id: 3,
      name: "Neha Shah",
      email: "neha@gmail.com",
      role: { value: "viewer", label: "Viewer" },
      permissions: ["View Orders", "View Reports"],
      isActive: false,
    },
  ]);

  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null); // null = add, object = edit
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleAddStaff = () => {
    setEditingStaff(null); // means Add
    setStaffModalOpen(true);
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff); // pass staff object
    setStaffModalOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .required("New password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Must include an uppercase letter")
        .matches(/[a-z]/, "Must include a lowercase letter")
        .matches(/[0-9]/, "Must include a number")
        .matches(/[!@#$%^&*]/, "Must include a special character (!@#$%^&*)"),
      confirmPassword: Yup.string()
        .required("Please confirm your new password")
        .oneOf([Yup.ref("newPassword")], "Passwords must match"),
    }),
    onSubmit: (values) => {
      // Password Update Payload
      // Call backend API to update password here
    },
  });

  const handleSaveStaff = (data) => {
    if (editingStaff) {
      // Edit existing staff
      setStaffList((prevList) =>
        prevList.map((staff) =>
          staff.id === editingStaff.id ? { ...staff, ...data } : staff
        )
      );
    } else {
      // Add new staff
      const newStaff = {
        ...data,
        id: Date.now(), // simple unique ID
        isActive: true,
      };
      setStaffList((prev) => [...prev, newStaff]);
    }

    setStaffModalOpen(false);
    setEditingStaff(null);
  };

  return (
    <>
      <form className="form_main" onSubmit={formik.handleSubmit}>
        <h5>Change Password</h5>

        {/* Current Password */}
        <div className="input_main mb-3">
          <label htmlFor="currentPassword" className="form-label">
            Current Password
          </label>
          <div className="password_input_wrapper">
            <input
              id="currentPassword"
              name="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              className="form-control"
              placeholder="Enter current password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currentPassword}
            />
            <span
              className="toggle_password"
              onClick={() => togglePassword("current")}
            >
              {showPasswords.current ? <EyeOff /> : <Eye />}
            </span>
          </div>
          {formik.touched.currentPassword && formik.errors.currentPassword && (
            <div className="error">{formik.errors.currentPassword}</div>
          )}
        </div>

        {/* New Password */}
        <div className="input_main mb-3">
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <div className="password_input_wrapper">
            <input
              id="newPassword"
              name="newPassword"
              type={showPasswords.new ? "text" : "password"}
              className="form-control"
              placeholder="Enter new password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
            />
            <span
              className="toggle_password"
              onClick={() => togglePassword("new")}
            >
              {showPasswords.new ? <EyeOff /> : <Eye />}
            </span>
          </div>
          {formik.touched.newPassword && formik.errors.newPassword && (
            <div className="error">{formik.errors.newPassword}</div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="input_main mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm New Password
          </label>
          <div className="password_input_wrapper">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              className="form-control"
              placeholder="Confirm new password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            <span
              className="toggle_password"
              onClick={() => togglePassword("confirm")}
            >
              {showPasswords.confirm ? <EyeOff /> : <Eye />}
            </span>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="error">{formik.errors.confirmPassword}</div>
          )}
        </div>

        <div className="submit_button text-start">
          <RippleButton
            type="submit"
            disabled={!formik.dirty || !formik.isValid}
          >
            Change Password
          </RippleButton>
        </div>
      </form>
      <hr />
      <div className="form_main">
        <h5 className="mb-1">Two-Factor Authentication (2FA)</h5>
        <p className="two_p">Add an extra layer of security to your account</p>
        <div className="toggle_row">
          <div className="toggle_main">
            <h6>
              Enable 2FA
              <br />
              <span>Use an authenticator app to secure your account</span>
            </h6>
            <label className="switch">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        {twoFactorEnabled && (
          <div className="two_factor_box">
            Two-factor authentication is enabled. You'll need to enter a
            verification code from your authenticator app each time you log in.
          </div>
        )}
      </div>
      <hr />
      <div className="form_main">
        <div className="h5_main">
          <h5>Staff Access</h5>
          <RippleButton className="add_staff_button" onClick={handleAddStaff}>
            <UserRoundPlus />
            Add Staff
          </RippleButton>
        </div>

        <div className="staff_list_main">
          <div className="staff_list">
            {staffList.map((staff) => (
              <div className="staff_card" key={staff.id}>
                <div className="staff_info">
                  <h6>
                    {staff.name}
                    <span className="default_tag">
                      {staff.isActive ? "Active" : "Inactive"}
                    </span>
                  </h6>
                  <p>{staff.email}</p>
                  <span className="manager_tag">{staff.role?.label}</span>
                  <h5>Permissions:</h5>
                  <div className="permission_tags">
                    {staff.permissions.map((perm, i) => (
                      <div className="permission_tag" key={i}>
                        {perm}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="staff_actions">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={staff.isActive}
                      onChange={() =>
                        setStaffList((prev) =>
                          prev.map((s) =>
                            s.id === staff.id
                              ? { ...s, isActive: !s.isActive }
                              : s
                          )
                        )
                      }
                    />
                    <span className="slider"></span>
                  </label>

                  <RippleButton
                    className="ripple-button edit_btn"
                    type="button"
                    onClick={() => handleEditStaff(staff)}
                  >
                    <Pencil size={16} />
                  </RippleButton>

                  <RippleButton
                    className="ripple-button delete_btn"
                    type="button"
                    onClick={() =>
                      setStaffList((prev) =>
                        prev.filter((s) => s.id !== staff.id)
                      )
                    }
                  >
                    <Trash2 size={16} />
                  </RippleButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AddStaffModal
        isOpen={staffModalOpen}
        onClose={() => setStaffModalOpen(false)}
        onSave={handleSaveStaff}
        initialData={editingStaff}
      />
    </>
  );
};

export default SecurityForm;
