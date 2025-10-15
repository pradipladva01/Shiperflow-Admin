import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormModal } from "../CommonModal";

const RecipientModal = ({ isOpen, onClose, onSave, initialData }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      channels: [],
      ...initialData,
    },
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter recipient name."),

      email: Yup.string().when("channels", (channels, schema) => {
        if (channels && channels.includes("Email")) {
          return schema
            .required("Email is required when Email channel is selected.")
            .email("Please enter a valid email address.");
        }
        return schema.nullable();
      }),

      phone: Yup.string().when("channels", (channels, schema) => {
        if (
          channels &&
          (channels.includes("SMS") || channels.includes("WhatsApp"))
        ) {
          return schema
            .required(
              "Phone number is required when SMS or WhatsApp is selected."
            )
            .matches(/^\d{10}$/, "Phone number must be exactly 10 digits.");
        }
        return schema.nullable();
      }),

      channels: Yup.array()
        .min(1, "Please select at least one notification channel.")
        .of(Yup.string().oneOf(["Email", "SMS", "WhatsApp"])),
    }),

    onSubmit: (values) => {
      onSave(values);
      formik.resetForm();
    },
  });

  useEffect(() => {
    // If email is empty, remove "Email" from channels
    if (
      !formik.values.email.trim() &&
      formik.values.channels.includes("Email")
    ) {
      const updated = formik.values.channels.filter((c) => c !== "Email");
      formik.setFieldValue("channels", updated);
    }

    // If phone is empty, remove "SMS" and "WhatsApp" from channels
    if (!formik.values.phone.trim()) {
      const updated = formik.values.channels.filter(
        (c) => c !== "SMS" && c !== "WhatsApp"
      );
      if (updated.length !== formik.values.channels.length) {
        formik.setFieldValue("channels", updated);
      }
    }
  }, [formik.values.email, formik.values.phone, formik]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Recipient" : "Add Recipient"}
      onSubmit={formik.handleSubmit}
      size="medium"
      submitText={initialData ? "Update Recipient" : "Save Recipient"}
      submitButtonProps={{
        onClick: () => {
          formik.setTouched({
            name: true,
            email: true,
            phone: true,
            channels: true,
          });
        },
        disabled: !formik.dirty || !formik.isValid,
      }}
    >
      <div className="input_main">
        <label>
          Name<span>*</span>
        </label>
        <input
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-control"
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-danger">{formik.errors.name}</div>
        )}
      </div>

      <div className="input_main">
        <h6>Email</h6>
        <input
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-control"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-danger">{formik.errors.email}</div>
        )}
      </div>

      <div className="input_main">
        <h6>Phone</h6>
        <input
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-control"
        />
        {formik.touched.phone && formik.errors.phone && (
          <div className="text-danger">{formik.errors.phone}</div>
        )}
      </div>

      <div className="form_check_main">
        <h6>
          Notification Channels <span>*</span>
        </h6>
        {["Email", "SMS", "WhatsApp"].map((ch) => {
          const isEmail = ch === "Email";
          const isPhoneChannel = ch === "SMS" || ch === "WhatsApp";

          const isDisabled =
            (isEmail && !formik.values.email.trim()) ||
            (isPhoneChannel && !formik.values.phone.trim());

          return (
            <div key={ch} className="form_check">
              <input
                type="checkbox"
                name="channels"
                value={ch}
                disabled={isDisabled}
                checked={formik.values.channels.includes(ch)}
                onChange={() => {
                  const channels = formik.values.channels.includes(ch)
                    ? formik.values.channels.filter((c) => c !== ch)
                    : [...formik.values.channels, ch];
                  formik.setFieldValue("channels", channels);
                }}
                className="form-check-input"
                id={ch}
              />
              <label htmlFor={ch} className="form-check-label">
                {ch}{" "}
                <span style={{ color: "#8891a0", fontSize: "12px" }}>
                  (
                  {ch === "Email"
                    ? "Provide email above"
                    : "Provide phone number above"}
                  )
                </span>
              </label>
            </div>
          );
        })}

        {formik.touched.channels && formik.errors.channels && (
          <div className="text-danger">{formik.errors.channels}</div>
        )}
      </div>
    </FormModal>
  );
};

export default RecipientModal;
