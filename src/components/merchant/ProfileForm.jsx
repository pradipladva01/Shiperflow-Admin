import React from "react";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import RippleButton from "./../RippleButton";
import { toast } from "react-toastify";

const businessOptions = [
  { value: "all", label: "All" },
  { value: "cod", label: "COD" },
  { value: "prepaid", label: "Prepaid" },
  { value: "reverse", label: "Reverse" },
];

const ProfileForm = () => {
  const formik = useFormik({
    initialValues: {
      businessName: "Dummy Store Pvt Ltd",
      businessType: { value: "cod", label: "COD" },
      gstNumber: "27ABCDE1234F1Z5",
      panNumber: "ABCDE1234F",
      contactName: "Ramesh Kumar",
      officialEmail: "dummy@store.com",
      phoneNumber: "9876543210",
      businessAddress: "123 Dummy Street, Mumbai, Maharashtra - 400001",
    },
    validationSchema: Yup.object({
      businessName: Yup.string().required("Business name is required"),
      businessType: Yup.mixed()
        .required("Business type is required")
        .nullable(),
      gstNumber: Yup.string()
        .required("GST number is required")
        .matches(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
          "Invalid GST number format"
        ),
      panNumber: Yup.string().required("PAN number is required"),
      contactName: Yup.string().required("Contact person name is required"),
      officialEmail: Yup.string()
        .email("Invalid email")
        .required("Official email is required"),
      phoneNumber: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      businessAddress: Yup.string().required("Business address is required"),
    }),

    onSubmit: (values, { resetForm }) => {
      // Form Data submitted
      toast.success("Changes saved successfully!");
    },
  });

  return (
    <form className="form_main" onSubmit={formik.handleSubmit}>
      <h5>Profile Details</h5>
      <div className="input_form_main">
        <div className="input_main">
          <label className="form-label">
            Business/Store Name <span>*</span>
          </label>
          <input
            type="text"
            name="businessName"
            className="form-control"
            placeholder="Enter business name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.businessName}
          />
          {formik.touched.businessName && formik.errors.businessName && (
            <div className="error">{formik.errors.businessName}</div>
          )}
        </div>
        <div className="input_main">
          <label className="form-label">
            Business Type <span>*</span>
          </label>
          <Select
            name="businessType"
            options={businessOptions}
            value={formik.values.businessType}
            onChange={(option) => formik.setFieldValue("businessType", option)}
            onBlur={() => formik.setFieldTouched("businessType", true)}
            className="option_select"
            placeholder="Select type"
          />
          {formik.touched.businessType && formik.errors.businessType && (
            <div className="error">{formik.errors.businessType}</div>
          )}
        </div>
        <div className="input_main">
          <label className="form-label">
            GST Number <span>*</span>
          </label>
          <input
            type="text"
            name="gstNumber"
            className="form-control"
            placeholder="Enter GST number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.gstNumber}
          />
          {formik.touched.gstNumber && formik.errors.gstNumber && (
            <div className="error">{formik.errors.gstNumber}</div>
          )}
        </div>
        <div className="input_main">
          <label className="form-label">
            PAN Number <span>*</span>
          </label>
          <input
            type="text"
            name="panNumber"
            className="form-control"
            placeholder="Enter PAN number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.panNumber}
          />
          {formik.touched.panNumber && formik.errors.panNumber && (
            <div className="error">{formik.errors.panNumber}</div>
          )}
        </div>
        <div className="input_main">
          <label className="form-label">
            Contact Person Name <span>*</span>
          </label>
          <input
            type="text"
            name="contactName"
            className="form-control"
            placeholder="Enter contact person name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.contactName}
          />
          {formik.touched.contactName && formik.errors.contactName && (
            <div className="error">{formik.errors.contactName}</div>
          )}
        </div>
        <div className="input_main">
          <label className="form-label">
            Official Email <span>*</span>
          </label>
          <input
            type="email"
            name="officialEmail"
            className="form-control"
            placeholder="Enter official email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.officialEmail}
          />
          {formik.touched.officialEmail && formik.errors.officialEmail && (
            <div className="error">{formik.errors.officialEmail}</div>
          )}
        </div>
        <div className="input_main">
          <label className="form-label">
            Phone Number <span>*</span>
          </label>
          <input
            type="text"
            name="phoneNumber"
            className="form-control"
            placeholder="Enter phone number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <div className="error">{formik.errors.phoneNumber}</div>
          )}
        </div>
      </div>
      <div className="input_main">
        <label className="form-label">
          Business Address <span>*</span>
        </label>
        <textarea
          name="businessAddress"
          className="form-control"
          placeholder="Enter business address"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.businessAddress}
        />
        {formik.touched.businessAddress && formik.errors.businessAddress && (
          <div className="error">{formik.errors.businessAddress}</div>
        )}
      </div>
      <div className="submit_button">
        <RippleButton type="submit" disabled={!formik.dirty || !formik.isValid}>
          Save Profile Setting
        </RippleButton>
      </div>
    </form>
  );
};

export default ProfileForm;
