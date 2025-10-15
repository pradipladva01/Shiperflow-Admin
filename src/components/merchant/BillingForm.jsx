import React, { useEffect } from "react";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import RippleButton from "../RippleButton";
import { X } from "lucide-react";
import noLogo from "../../resources/images/200x80.svg";

// Billing options
const billingCycleOptions = [
  { value: "cod", label: "Weekly" },
  { value: "all", label: "Monthly" },
];

const BillingForm = () => {
  const formik = useFormik({
    initialValues: {
      gstIn: "",
      pan: "",
      billingAddress: "",
      billingCycle: null,
      logo: null,
    },
    validationSchema: Yup.object({
      gstIn: Yup.string()
        .matches(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
          "Invalid GSTIN format"
        )
        .nullable(),
      pan: Yup.string()
        .required("PAN is required")
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format"),
      billingAddress: Yup.string().required("Billing address is required"),
      billingCycle: Yup.object()
        .shape({
          label: Yup.string().required(),
          value: Yup.string().required(),
        })
        .nullable()
        .required("Billing cycle is required"),
      logo: Yup.mixed()
        .nullable()
        .test("fileSize", "File size must be under 1MB", (value) => {
          if (!value) return true;
          return value.size <= 1024 * 1024;
        })
        .test("fileType", "Unsupported file type", (value) => {
          if (!value) return true;
          return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
        }),
    }),
    onSubmit: (values) => {
      const reader = new FileReader();
      if (values.logo) {
        reader.onloadend = () => {
          const payload = {
            ...values,
            logo: reader.result,
          };
          // Submitted payload with logo
        };
        reader.readAsDataURL(values.logo);
      } else {
        // Submitted payload without logo
      }
    },
  });

  // Remove logo handler
  const handleRemoveLogo = () => {
    formik.setFieldValue("logo", null);
  };
  return (
    <form className="form_main" onSubmit={formik.handleSubmit}>
      <h5>Tax Information</h5>
      <div className="input_form_main">
        <div className="input_main">
          <label className="form-label">GSTIN</label>
          <input
            type="text"
            name="gstIn"
            className="form-control"
            placeholder="Enter GSTIN"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.gstIn}
          />
          {formik.touched.gstIn && formik.errors.gstIn && (
            <div className="error">{formik.errors.gstIn}</div>
          )}
        </div>
        <div className="input_main">
          <label className="form-label">PAN</label>
          <input
            type="text"
            name="pan"
            className="form-control"
            placeholder="Enter PAN"
            onChange={(e) =>
              formik.setFieldValue("pan", e.target.value.toUpperCase())
            }
            onBlur={formik.handleBlur}
            value={formik.values.pan}
          />
          {formik.touched.pan && formik.errors.pan && (
            <div className="error">{formik.errors.pan}</div>
          )}
        </div>
      </div>

      <hr />
      <h5>Billing Address</h5>
      <div className="input_main">
        <label className="form-label">
          Billing Address <span>*</span>
        </label>
        <textarea
          name="billingAddress"
          className="form-control"
          placeholder="Enter address"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.billingAddress}
        />
        {formik.touched.billingAddress && formik.errors.billingAddress && (
          <div className="error">{formik.errors.billingAddress}</div>
        )}
      </div>

      <hr />
      <h5>
        Invoice Branding <br />
        <span>Add your logo to customize your invoices</span>
      </h5>
      <div className="input_main">
        <div className="logo_upload_container">
          {formik.values.logo ? (
            <div style={{ textAlign: "center", position: "relative" }}>
              <img
                src={URL.createObjectURL(formik.values.logo)}
                alt="Uploaded Logo"
                className="upload_img"
              />
              <br />
              <RippleButton
                type="button"
                className="remove_btn"
                onClick={handleRemoveLogo}
              >
                <X />
              </RippleButton>
            </div>
          ) : (
            <div className="no_logo_upload">
              <img src={noLogo} alt="No Logo" />
            </div>
          )}
        </div>

        <div className="upload_btn_main">
          <label className="upload_btn">
            Upload Logo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.currentTarget.files[0];
                formik.setFieldValue("logo", file ?? null);
              }}
              style={{ display: "none" }}
            />
          </label>
          <small>Max size: 1MB. Recommended: 200x80px</small>
        </div>
        {formik.errors.logo && (
          <div className="error">{formik.errors.logo}</div>
        )}
      </div>

      <hr />
      <h5>Billing Cycle</h5>
      <div className="input_form_main">
        <div className="input_main">
          <label className="form-label">
            Billing Cycle <span>*</span>
          </label>
          <Select
            name="billingCycle"
            options={billingCycleOptions}
            value={formik.values.billingCycle}
            onChange={(option) => formik.setFieldValue("billingCycle", option)}
            onBlur={() => formik.setFieldTouched("billingCycle", true)}
            className="option_select"
            placeholder="Select type"
            isDisabled={true}
          />
          {formik.touched.billingCycle && formik.errors.billingCycle && (
            <div className="error">{formik.errors.billingCycle}</div>
          )}
        </div>
      </div>

      <div className="submit_button">
        <RippleButton type="submit" disabled={!formik.isValid || !formik.dirty}>
          Save Profile Setting
        </RippleButton>
      </div>
    </form>
  );
};

export default BillingForm;
