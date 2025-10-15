import React from "react";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormModal } from "./CommonModal";

const permissionList = [
  "View Orders",
  "Manage Orders",
  "View Shipments",
  "Create Shipments",
  "View Reports",
  "View Settings",
  "Edit Settings",
];

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "operator", label: "Operator" },
  { value: "viewer", label: "Viewer" },
];

const AddStaffModal = ({ isOpen, onClose, onSave, initialData }) => {
  const formik = useFormik({
    initialValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      role: initialData?.role || null,
      permissions: initialData?.permissions || [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      role: Yup.object()
        .shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        })
        .nullable()
        .required("Role is required"),
      permissions: Yup.array()
        .min(1, "At least one permission is required")
        .of(Yup.string().required()),
    }),
    onSubmit: (values, { resetForm }) => {
      onSave(values);
      resetForm();
      onClose();
    },
    enableReinitialize: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await formik.validateForm();
    formik.setTouched({
      name: true,
      email: true,
      role: true,
      permissions: true,
    });

    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      formik.handleSubmit();
    }
  };

  const handlePermissionChange = (permission) => {
    const current = formik.values.permissions;
    if (current.includes(permission)) {
      formik.setFieldValue(
        "permissions",
        current.filter((p) => p !== permission)
      );
    } else {
      formik.setFieldValue("permissions", [...current, permission]);
    }
  };

  const allPermissions = [
    "View Orders",
    "Manage Orders",
    "View Shipments",
    "Create Shipments",
    "View Reports",
    "View Settings",
    "Edit Settings",
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Staff Member" : "Add Staff Member"}
      onSubmit={handleSubmit}
      size="medium"
      submitText="Save"
      cancelText="Cancel"
    >
      {/* Name */}
      <div className="input_main">
        <label>
          Name <span>*</span>
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          {...formik.getFieldProps("name")}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="error">{formik.errors.name}</div>
        )}
      </div>

      {/* Email */}
      <div className="input_main">
        <label>
          Email <span>*</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          {...formik.getFieldProps("email")}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="error">{formik.errors.email}</div>
        )}
      </div>

      {/* Role */}
      <div className="input_main">
        <label>
          Role <span>*</span>
        </label>
        <Select
          name="role"
          options={roleOptions}
          value={formik.values.role}
          className="option_select"
          onChange={(selectedOption) => {
            formik.setFieldValue("role", selectedOption);

            let permissions = [];

            switch (selectedOption?.value) {
              case "admin":
                permissions = [...allPermissions];
                break;

              case "manager":
                permissions = allPermissions.filter(
                  (p) => p !== "Edit Settings"
                );
                break;

              case "operator":
                permissions = allPermissions.filter(
                  (p) =>
                    ![
                      "View Reports",
                      "View Settings",
                      "Edit Settings",
                    ].includes(p)
                );
                break;

              case "viewer":
                permissions = allPermissions.filter(
                  (p) =>
                    ![
                      "Manage Orders",
                      "Create Shipments",
                      "Edit Settings",
                    ].includes(p)
                );
                break;

              default:
                permissions = [];
            }

            formik.setFieldValue("permissions", permissions);
          }}
          placeholder="Select role"
        />

        {formik.touched.role && formik.errors.role && (
          <div className="error">{formik.errors.role}</div>
        )}
      </div>

      {/* Permissions */}
      <div className="input_main">
        <label>
          Permissions <span>*</span>
        </label>
        <div className="permissions_checkbox_list">
          {permissionList.map((perm, idx) => {
            const id = `perm-${idx}`;
            return (
              <div className="form_check" key={perm}>
                <input
                  id={id}
                  type="checkbox"
                  className="form-check-input"
                  checked={formik.values.permissions.includes(perm)}
                  onChange={() => handlePermissionChange(perm)}
                />
                <label htmlFor={id} className="form-check-label">
                  {perm}
                </label>
              </div>
            );
          })}
        </div>
        {formik.touched.permissions && formik.errors.permissions && (
          <div className="error">{formik.errors.permissions}</div>
        )}
      </div>
    </FormModal>
  );
};

export default AddStaffModal;
