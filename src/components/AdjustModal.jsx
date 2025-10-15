import React from "react";
import { FormModal } from "./CommonModal";

const AdjustModal = ({ formik, setShowAdjustModal }) => {
  return (
    <FormModal
      isOpen={true}
      onClose={() => setShowAdjustModal(false)}
      title="Adjust Payment"
      onSubmit={formik.handleSubmit}
      size="medium"
      submitText="Confirm Adjustment"
      className="adjust_modal"
      cancelText="Cancel"
      submitButtonProps={{
        disabled: !formik.isValid || !formik.dirty,
        className: "resolve_button",
      }}
      cancelButtonProps={{
        className: "cancel_btn",
      }}
    >
      <div className="input_main">
        <label>Merchant</label>
        <input
          type="text"
          value={formik.values.merchant}
          readOnly
          placeholder="Merchant Name"
        />
      </div>

      <div className="input_main">
        <label>
          Amount <span>*</span>
        </label>
        <input
          type="number"
          name="amount"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter amount (negative for deduction)"
          autoFocus
        />
        {formik.touched.amount && formik.errors.amount && (
          <div className="error">{formik.errors.amount}</div>
        )}
      </div>

      <div className="input_main">
        <label>
          Reason <span>*</span>
        </label>
        <textarea
          name="reason"
          value={formik.values.reason}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Explain reason for adjustment"
        />
        {formik.touched.reason && formik.errors.reason && (
          <div className="error">{formik.errors.reason}</div>
        )}
      </div>
    </FormModal>
  );
};

export default AdjustModal;
