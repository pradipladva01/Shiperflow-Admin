import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormModal } from "./CommonModal";

const PickupLocationModal = ({ isOpen, onClose, onSave, initialData }) => {
  const formik = useFormik({
    initialValues: {
      locationName: initialData?.locationName || "",
      contactPerson: initialData?.contactPerson || "",
      phoneNumber: initialData?.phoneNumber || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      pinCode: initialData?.pinCode || "",
      isDefault: initialData?.isDefault || false,
    },
    validationSchema: Yup.object({
      locationName: Yup.string().required("Location name is required"),
      contactPerson: Yup.string().required("Contact person is required"),
      phoneNumber: Yup.string().required("Phone number is required"),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      pinCode: Yup.string().required("Pincode is required"),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      onSave(values);
      resetForm(); // optional, reset form if needed
      setSubmitting(false);
      onClose();
    },
    enableReinitialize: true,
  });

  if (!isOpen) return null;

  const renderError = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <div className="error">{formik.errors[field]}</div>
    ) : null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Pickup Location" : "Add Pickup Location"}
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit(e);
      }}
      size="medium"
      submitText={initialData ? "Save Changes" : "Save Address"}
      cancelText="Cancel"
      submitButtonProps={{
        disabled: !formik.isValid || !formik.dirty,
      }}
    >
      <div className="input_main">
        <label>
          Location Name <span>*</span>
        </label>
        <input
          type="text"
          name="locationName"
          {...formik.getFieldProps("locationName")}
          onBlur={formik.handleBlur}
          placeholder="Enter location name"
        />
        {renderError("locationName")}
      </div>

      <div className="form-row">
        <div className="input_main">
          <label>
            Contact Person <span>*</span>
          </label>
          <input
            type="text"
            name="contactPerson"
            {...formik.getFieldProps("contactPerson")}
          />
          {renderError("contactPerson")}
        </div>
        <div className="input_main">
          <label>
            Phone Number <span>*</span>
          </label>
          <input
            type="text"
            name="phoneNumber"
            {...formik.getFieldProps("phoneNumber")}
          />
          {renderError("phoneNumber")}
        </div>
      </div>

      <div className="form-row">
        <div className="input_main">
          <label>
            Address <span>*</span>
          </label>
          <input
            type="text"
            name="address"
            {...formik.getFieldProps("address")}
          />
          {renderError("address")}
        </div>
        <div className="input_main">
          <label>
            City <span>*</span>
          </label>
          <input type="text" name="city" {...formik.getFieldProps("city")} />
          {renderError("city")}
        </div>
      </div>

      <div className="form-row">
        <div className="input_main">
          <label>
            State <span>*</span>
          </label>
          <input type="text" name="state" {...formik.getFieldProps("state")} />
          {renderError("state")}
        </div>
        <div className="input_main">
          <label>
            Pincode <span>*</span>
          </label>
          <input
            type="text"
            name="pinCode"
            {...formik.getFieldProps("pinCode")}
          />
          {renderError("pinCode")}
        </div>
      </div>

      <label className="switch_label_main">
        <input
          type="checkbox"
          id="isDefault"
          checked={formik.values.isDefault}
          onChange={() =>
            formik.setFieldValue("isDefault", !formik.values.isDefault)
          }
        />
        <span className="slider"></span>
        <span className="switch-label">Set as default pickup location</span>
      </label>
    </FormModal>
  );
};

export default PickupLocationModal;
