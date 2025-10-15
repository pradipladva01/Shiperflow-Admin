import React from "react";
import Select from "react-select";
import RippleButton from "../RippleButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const businessOptions = [
  { value: "reattempt", label: "Reattempt Delivery" },
  { value: "contact", label: "Contact Customer" },
  { value: "rto", label: "Mark Return to Origin (RTO)" },
];

const callPreference = [
  { value: "merchant", label: "Merchant (You)" },
  { value: "courier", label: "Courier Partner" },
];

const NDRForm = () => {
  const formik = useFormik({
    initialValues: {
      defaultAction: null,
      autoRto: false,
      callPreference: null,
      templateMessage:
        "Dear Customer,\n\nWe tried to deliver your order but were unable to do so. Please contact us at [PHONE] to reschedule delivery.\n\nThank you,\n[STORE_NAME]",
    },
    validationSchema: Yup.object({
      defaultAction: Yup.object()
        .nullable()
        .required("Default Action is required"),
      callPreference: Yup.object()
        .nullable()
        .required("Call Preference is required"),
      templateMessage: Yup.string().required("Message is required"),
    }),
    onSubmit: (values) => {
      // Form submitted
      toast.success("Changes saved successfully!");
    },
  });

  return (
    <form className="form_main" onSubmit={formik.handleSubmit}>
      <h5>NDR (Non-Delivery Report) Settings</h5>
      <div className="input_main">
        <label className="form-label">
          Default Action <span>*</span>
        </label>
        <Select
          name="defaultAction"
          options={businessOptions}
          value={formik.values.defaultAction}
          onChange={(option) => formik.setFieldValue("defaultAction", option)}
          onBlur={() => formik.setFieldTouched("defaultAction", true)}
          className="option_select"
          placeholder="Default Action"
        />
        {formik.touched.defaultAction && formik.errors.defaultAction && (
          <div className="error">{formik.errors.defaultAction}</div>
        )}
      </div>

      {/* Auto RTO */}
      <div className="toggle_row mb-3">
        <div className="toggle_main">
          <h6>
            Auto RTO Approval
            <br />
            <span>
              Automatically approve return to origin after failed delivery
              attempts
            </span>
          </h6>
          <label className="switch">
            <input
              type="checkbox"
              checked={formik.values.autoRto}
              onChange={(e) =>
                formik.setFieldValue("autoRto", e.target.checked)
              }
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Call Preference */}
      <div className="input_main mb-4">
        <label className="form-label">
          Customer Call Preference <span>*</span>
        </label>
        <Select
          name="callPreference"
          options={callPreference}
          value={formik.values.callPreference}
          onChange={(option) => formik.setFieldValue("callPreference", option)}
          onBlur={() => formik.setFieldTouched("callPreference", true)}
          className="option_select"
          placeholder="Call Preference"
        />
        {formik.touched.callPreference && formik.errors.callPreference && (
          <div className="error">{formik.errors.callPreference}</div>
        )}
      </div>

      {/* Message Template */}
      <h5>Customer Communication Template</h5>
      <div className="input_main">
        <label className="form-label">
          Message Template <span>*</span>
        </label>
        <textarea
          name="templateMessage"
          className="option_select"
          placeholder="Default Action"
          value={formik.values.templateMessage}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.templateMessage && formik.errors.templateMessage && (
          <div className="error">{formik.errors.templateMessage}</div>
        )}
      </div>

      {/* Variables */}
      <div className="variable_info_box">
        <h6>Available Variables:</h6>
        <ul className="variable_list">
          <li>
            <code>[CUSTOMER_NAME]</code> – Customer's name
          </li>
          <li>
            <code>[ORDER_NUMBER]</code> – Order ID/number
          </li>
          <li>
            <code>[DELIVERY_DATE]</code> – Attempted delivery date
          </li>
          <li>
            <code>[PHONE]</code> – Your contact number
          </li>
          <li>
            <code>[STORE_NAME]</code> – Your store name
          </li>
        </ul>
      </div>

      {/* Submit Button */}
      <div className="submit_button">
        <RippleButton
          type="submit"
          disabled={!(formik.dirty && formik.isValid)}
        >
          Save Shipping Settings
        </RippleButton>
      </div>
    </form>
  );
};

export default NDRForm;
