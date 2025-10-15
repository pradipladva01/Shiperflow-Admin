import React from "react";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import RippleButton from "../RippleButton";
import { toast } from "react-toastify";

const payoutCycleOptions = [
  { value: "weekly", label: "Weekly" },
  { value: "bi-weekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
];

const payoutMethodOptions = [
  { value: "upi", label: "UPI" },
  { value: "bank-transfer", label: "Bank Transfer" },
];

const BankForm = () => {

  const formik = useFormik({
    initialValues: {
      accountHolder: "Ramesh Kumar",
      accountNumber: "123456789012",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      branchName: "Andheri West",
      upiId: "ramesh@upi",
      payoutCycle: { value: "weekly", label: "Weekly" },
      payoutMethod: { value: "bank-transfer", label: "Bank Transfer" },
    },
    validationSchema: Yup.object({
      accountHolder: Yup.string().required("Account holder name is required"),

      accountNumber: Yup.string()
        .matches(/^\d+$/, "Account number must contain only digits")
        .min(9, "Account number must be at least 9 digits")
        .max(18, "Account number can't be more than 18 digits")
        .required("Account number is required"),

      ifscCode: Yup.string()
        .matches(
          /^[A-Z]{4}0[A-Z0-9]{6}$/,
          "Enter a valid IFSC code"
        )
        .required("IFSC code is required"),

      bankName: Yup.string().required("Bank name is required"),

      branchName: Yup.string().required("Branch name is required"),

      upiId: Yup.string()
        .matches(
          /^[\w.-]+@[\w.-]+$/,
          "Enter a valid UPI ID (e.g. username@bank)"
        )
        .required("UPI ID is required"),

      payoutCycle: Yup.object()
        .nullable()
        .required("Please select payout cycle"),

      payoutMethod: Yup.object()
        .nullable()
        .required("Please select payout method"),
    }),
    onSubmit: (values, { resetForm }) => {
      toast.success("Bank details saved!");
      resetForm({ values }); 
    },
  });

  return (
    <form className="form_main" onSubmit={formik.handleSubmit}>
      <h5>Bank Account Details</h5>
      <div className="input_form_main">
        {[
          { name: "accountHolder", label: "Account Holder Name" },
          { name: "accountNumber", label: "Account Number" },
          { name: "ifscCode", label: "IFSC Code" },
          { name: "bankName", label: "Bank Name" },
          { name: "branchName", label: "Branch Name" },
          { name: "upiId", label: "UPI ID" },
        ].map((field) => (
          <div className="input_main" key={field.name}>
            <label className="form-label">
              {field.label} <span>*</span>
            </label>
            <input
              type="text"
              name={field.name}
              className="form-control"
              placeholder={`Enter ${field.label}`}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched[field.name] && formik.errors[field.name] && (
              <div className="error">{formik.errors[field.name]}</div>
            )}
          </div>
        ))}
      </div>

      <h5>Payout Preferences</h5>
      <div className="input_form_main">
        <div className="input_main">
          <label className="form-label">
            Payout Cycle <span>*</span>
          </label>
          <Select
            name="payoutCycle"
            options={payoutCycleOptions}
            value={formik.values.payoutCycle}
            onChange={(option) => formik.setFieldValue("payoutCycle", option)}
            onBlur={() => formik.setFieldTouched("payoutCycle", true)}
            className="option_select"
            placeholder="Select payout cycle"
          />
          {formik.touched.payoutCycle && formik.errors.payoutCycle && (
            <div className="error">{formik.errors.payoutCycle}</div>
          )}
        </div>

        <div className="input_main">
          <label className="form-label">
            Preferred Payout Method <span>*</span>
          </label>
          <Select
            name="payoutMethod"
            options={payoutMethodOptions}
            value={formik.values.payoutMethod}
            onChange={(option) => formik.setFieldValue("payoutMethod", option)}
            onBlur={() => formik.setFieldTouched("payoutMethod", true)}
            className="option_select"
            placeholder="Select payout method"
          />
          {formik.touched.payoutMethod && formik.errors.payoutMethod && (
            <div className="error">{formik.errors.payoutMethod}</div>
          )}
        </div>
      </div>

      <div className="submit_button">
        <RippleButton type="submit" disabled={!formik.dirty || !formik.isValid}>
          Save Bank Details
        </RippleButton>
      </div>
    </form>
  );
};

export default BankForm;
