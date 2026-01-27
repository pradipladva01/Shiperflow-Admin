import React, { useState } from "react";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import RippleButton from "../components/RippleButton";
import Input from "../components/Input";
import { toast } from "react-toastify";
import { Check, Trash2, Plus, Copy } from "lucide-react";
import { api } from "../utils/axiosUtils";

const SuperAdminSettings = () => {
  const [activeTab, setActiveTab] = useState("user");
  const [formData, setFormData] = useState({
    // User settings
    maxUsers: 100,
    userRegistrationEnabled: true,
    passwordPolicy: "strong",
    sessionTimeout: 30,

    // Notification settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notificationFrequency: "immediate",
    adminEmail: "",
    notificationChannels: {
      orderUpdates: true,
      systemAlerts: true,
      userActivity: false,
      securityAlerts: true,
    },
  });

  // Courier Partner Options
  const courierPartnerOptions = [
    { value: "delhivery", label: "Delhivery" },
    { value: "blue-dart", label: "Blue Dart" },
    { value: "dtdc", label: "DTDC" },
    { value: "xpressbees", label: "Xpressbees" },
    { value: "ekart", label: "Ekart" },
    { value: "shiprocket", label: "Shiprocket" },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeZone, setActiveZone] = useState("A");
  // eslint-disable-next-line no-unused-vars
  const [isSavingRateCard, setIsSavingRateCard] = useState(false);

  const zones = ["A", "B", "C", "D", "E", "Special"];

  const rateCardFormik = useFormik({
    initialValues: {
      // Step 1: Courier Details
      courierPartner: null,
      courierMode: "surface",
      rateCardName: "",
      status: false,

      // Step 2 & 3: Forward and RTO Rates (zone-wise)
      forwardRates: {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        Special: [],
      },
      rtoRates: {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        Special: [],
      },

      // Step 5: COD Fees
      codEnabled: false,
      fixedCodFee: 0,
      percentageCodFee: 0,
      minCodCap: 0,
      maxCodCap: 0,

      // Step 6: Additional Charges
      additionalCharges: [
        {
          enabled: true,
          chargeName: "",
          type: "fixed",
          value: 0,
          appliesOn: "forward",
        },
      ],
    },
    validationSchema: Yup.object({
      courierPartner: Yup.object()
        .shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        })
        .nullable()
        .required("Courier partner is required"),
      courierMode: Yup.string()
        .oneOf(["surface", "air"], "Invalid courier mode")
        .required("Courier mode is required"),
      rateCardName: Yup.string()
        .required("Rate card name is required")
        .min(3, "Rate card name must be at least 3 characters")
        .max(100, "Rate card name must not exceed 100 characters"),
      status: Yup.boolean(),
      forwardRates: Yup.object().test(
        "all-zones-have-slabs",
        "All zones must have at least one rate slab",
        function (value) {
          return zones.every((zone) => value[zone] && value[zone].length > 0);
        }
      ),
      rtoRates: Yup.object().test(
        "all-zones-have-slabs",
        "All zones must have at least one rate slab",
        function (value) {
          return zones.every((zone) => value[zone] && value[zone].length > 0);
        }
      ),
    }),
    onSubmit: async (values) => {
      setIsSavingRateCard(true);
      console.log("Rate Card Data:", values);

      try {
        // Prepare the data for API
        const rateCardData = {
          courierPartner: values.courierPartner?.value || null,
          courierMode: values.courierMode,
          rateCardName: values.rateCardName,
          status: values.status,
          forwardRates: values.forwardRates,
          rtoRates: values.rtoRates,
          codEnabled: values.codEnabled,
          fixedCodFee: values.fixedCodFee,
          percentageCodFee: values.percentageCodFee,
          minCodCap: values.minCodCap,
          maxCodCap: values.maxCodCap,
          additionalCharges: values.additionalCharges,
        };

        // API call to save rate card
        // TODO: Update the endpoint URL as per your backend API
        const response = await api.post("/rate-cards", rateCardData);

        if (response.data) {
          toast.success(
            response.data?.message || "Rate card created successfully!"
          );
          // Reset form and go back to step 1
          setCurrentStep(1);
          setCompletedSteps([]);
          rateCardFormik.resetForm();
        }
      } catch (error) {
        console.error("Error saving rate card:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to save rate card. Please try again."
        );
      } finally {
        setIsSavingRateCard(false);
      }
    },
  });

  // Helper functions for weight slabs
  const addWeightSlab = (type, zone) => {
    const field = type === "forward" ? "forwardRates" : "rtoRates";
    const currentSlabs = rateCardFormik.values[field][zone] || [];
    const newSlab = {
      id: Date.now(),
      minWeight: "",
      maxWeight: "",
      rate: "",
    };
    rateCardFormik.setFieldValue(`${field}.${zone}`, [
      ...currentSlabs,
      newSlab,
    ]);
  };

  const removeWeightSlab = (type, zone, id) => {
    const field = type === "forward" ? "forwardRates" : "rtoRates";
    const currentSlabs = rateCardFormik.values[field][zone] || [];
    rateCardFormik.setFieldValue(
      `${field}.${zone}`,
      currentSlabs.filter((slab) => slab.id !== id)
    );
  };

  const updateWeightSlab = (type, zone, id, field, value) => {
    const rateField = type === "forward" ? "forwardRates" : "rtoRates";
    const currentSlabs = rateCardFormik.values[rateField][zone] || [];
    const updatedSlabs = currentSlabs.map((slab) =>
      slab.id === id ? { ...slab, [field]: value } : slab
    );
    rateCardFormik.setFieldValue(`${rateField}.${zone}`, updatedSlabs);
  };

  const copyWeightSlabs = (type, fromZone, toZone) => {
    const field = type === "forward" ? "forwardRates" : "rtoRates";
    const sourceSlabs = rateCardFormik.values[field][fromZone] || [];
    rateCardFormik.setFieldValue(
      `${field}.${toZone}`,
      sourceSlabs.map((slab) => ({ ...slab, id: Date.now() + Math.random() }))
    );
  };

  const addAdditionalCharge = () => {
    const currentCharges = rateCardFormik.values.additionalCharges || [];
    rateCardFormik.setFieldValue("additionalCharges", [
      ...currentCharges,
      {
        enabled: true,
        chargeName: "",
        type: "fixed",
        value: 0,
        appliesOn: "forward",
      },
    ]);
  };

  const removeAdditionalCharge = (index) => {
    const currentCharges = rateCardFormik.values.additionalCharges || [];
    rateCardFormik.setFieldValue(
      "additionalCharges",
      currentCharges.filter((_, i) => i !== index)
    );
  };

  // eslint-disable-next-line no-unused-vars
  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      rateCardFormik.validateField("courierPartner");
      rateCardFormik.validateField("courierMode");
      rateCardFormik.validateField("rateCardName");
      if (
        rateCardFormik.errors.courierPartner ||
        rateCardFormik.errors.courierMode ||
        rateCardFormik.errors.rateCardName
      ) {
        return;
      }
      setCompletedSteps([...completedSteps, 1]);
    }
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const steps = [
    { id: 1, label: "Courier Details", required: false },
    { id: 2, label: "Forward Rates", required: true },
    { id: 3, label: "RTO Rates", required: true },
    { id: 4, label: "Zone Pricing", required: false },
    { id: 5, label: "COD Fees", required: false },
    { id: 6, label: "Additional Charges", required: false },
    { id: 7, label: "Review & Save", required: false },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add API call here
  };

  const tabs = [
    { id: "user", label: "User" },
    { id: "notification", label: "Notification" },
    // { id: "rateCard", label: "Rate Card" },
  ];

  // Render Step Content
  // eslint-disable-next-line no-unused-vars
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="rate_card_step">
            <h5>Courier Details</h5>
            <p className="step_description">
              Configure courier-wise pricing with mandatory Forward and RTO
              rates
            </p>

            <div className="input_form_main">
              <div className="input_main">
                <label>
                  Courier Partner <span>*</span>
                </label>
                <Select
                  name="courierPartner"
                  options={courierPartnerOptions}
                  value={rateCardFormik.values.courierPartner}
                  onChange={(option) =>
                    rateCardFormik.setFieldValue("courierPartner", option)
                  }
                  onBlur={() =>
                    rateCardFormik.setFieldTouched("courierPartner", true)
                  }
                  className="option_select"
                  placeholder="Select courier partner"
                  isSearchable={true}
                />
                {rateCardFormik.touched.courierPartner &&
                  rateCardFormik.errors.courierPartner && (
                    <div className="error">
                      {rateCardFormik.errors.courierPartner}
                    </div>
                  )}
              </div>

              <div className="input_main">
                <label>
                  Courier Mode <span>*</span>
                </label>
                <div className="radio_group">
                  <label className="radio_option">
                    <input
                      type="radio"
                      name="courierMode"
                      value="surface"
                      checked={rateCardFormik.values.courierMode === "surface"}
                      onChange={rateCardFormik.handleChange}
                      onBlur={rateCardFormik.handleBlur}
                    />
                    <span>Surface</span>
                  </label>
                  <label className="radio_option">
                    <input
                      type="radio"
                      name="courierMode"
                      value="air"
                      checked={rateCardFormik.values.courierMode === "air"}
                      onChange={rateCardFormik.handleChange}
                      onBlur={rateCardFormik.handleBlur}
                    />
                    <span>Air</span>
                  </label>
                </div>
                {rateCardFormik.touched.courierMode &&
                  rateCardFormik.errors.courierMode && (
                    <div className="error">
                      {rateCardFormik.errors.courierMode}
                    </div>
                  )}
              </div>
            </div>

            <Input
              type="text"
              name="rateCardName"
              label="Rate Card Name"
              placeholder="e.g., Delhivery Surface Standard Rates"
              value={rateCardFormik.values.rateCardName}
              onChange={rateCardFormik.handleChange}
              onBlur={rateCardFormik.handleBlur}
              required={true}
              error={
                rateCardFormik.touched.rateCardName &&
                rateCardFormik.errors.rateCardName
                  ? rateCardFormik.errors.rateCardName
                  : ""
              }
            />
            <span className="field_description">
              A descriptive name for this rate card
            </span>

            <div className="toggle_row">
              <div className="toggle_main">
                <h6>
                  Status
                  <br />
                  <span>
                    Rate card will be inactive by default. Activate after
                    completing all steps.
                  </span>
                </h6>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="status"
                    checked={rateCardFormik.values.status}
                    onChange={(e) =>
                      rateCardFormik.setFieldValue("status", e.target.checked)
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        const missingForwardZones = zones.filter(
          (zone) =>
            !rateCardFormik.values.forwardRates[zone] ||
            rateCardFormik.values.forwardRates[zone].length === 0
        );

        return (
          <div className="rate_card_step">
            <h5>
              Forward Rate Configuration{" "}
              <span className="required_badge">*Required</span>
            </h5>
            <p className="step_description">
              Configure weight-based forward shipping rates for each zone. All
              zones must have at least one rate slab.
            </p>

            {missingForwardZones.length > 0 && (
              <div className="incomplete_warning">
                <strong>Incomplete Configuration</strong>
                <p>Missing zones: {missingForwardZones.join(", ")}</p>
                {missingForwardZones.map((zone) => (
                  <p key={zone}>Zone {zone} has no rate slabs configured</p>
                ))}
              </div>
            )}

            <div className="zone_tabs">
              {zones.map((zone) => (
                <button
                  key={zone}
                  type="button"
                  className={`zone_tab ${activeZone === zone ? "active" : ""}`}
                  onClick={() => setActiveZone(zone)}
                >
                  Zone {zone}
                </button>
              ))}
            </div>

            <div className="zone_content">
              <div className="zone_header">
                <h6>Zone {activeZone}</h6>
                <div className="copy_zone_dropdown">
                  <label>Copy rates from another zone</label>
                  <Select
                    options={zones
                      .filter((z) => z !== activeZone)
                      .map((z) => ({ value: z, label: `Zone ${z}` }))}
                    placeholder="Select zone to copy from"
                    onChange={(option) => {
                      if (option) {
                        copyWeightSlabs("forward", option.value, activeZone);
                      }
                    }}
                    className="option_select"
                    isSearchable={false}
                  />
                </div>
              </div>

              <div className="weight_slabs_table">
                <table>
                  <thead>
                    <tr>
                      <th>Min Weight (kg)</th>
                      <th>Max Weight (kg)</th>
                      <th>Forward Rate (₹)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateCardFormik.values.forwardRates[activeZone]?.map(
                      (slab, index) => (
                        <tr key={slab.id || index}>
                          <td>
                            <Input
                              type="number"
                              value={slab.minWeight || ""}
                              onChange={(e) =>
                                updateWeightSlab(
                                  "forward",
                                  activeZone,
                                  slab.id,
                                  "minWeight",
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              className="table_input"
                            />
                          </td>
                          <td>
                            <Input
                              type="number"
                              value={slab.maxWeight || ""}
                              onChange={(e) =>
                                updateWeightSlab(
                                  "forward",
                                  activeZone,
                                  slab.id,
                                  "maxWeight",
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              className="table_input"
                            />
                          </td>
                          <td>
                            <Input
                              type="number"
                              value={slab.rate || ""}
                              onChange={(e) =>
                                updateWeightSlab(
                                  "forward",
                                  activeZone,
                                  slab.id,
                                  "rate",
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              className="table_input"
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="delete_slab_btn"
                              onClick={() =>
                                removeWeightSlab("forward", activeZone, slab.id)
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <button
                  type="button"
                  className="add_slab_btn"
                  onClick={() => addWeightSlab("forward", activeZone)}
                >
                  <Plus size={16} /> Add Weight Slab
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="rate_card_step">
            <h5>
              RTO Rate Configuration{" "}
              <span className="required_badge">*Required</span>
            </h5>
            <p className="step_description">
              Configure Return-to-Origin (RTO) rates for each zone. Weight slabs
              are auto-copied from Forward rates, but you must set RTO rates
              manually.
            </p>

            <div className="info_box">
              <strong>Important</strong>
              <p>
                RTO rates cannot be auto-linked to Forward rates. You must
                manually enter the RTO rate for each weight slab in every zone.
              </p>
            </div>

            <div className="zone_tabs">
              {zones.map((zone) => (
                <button
                  key={zone}
                  type="button"
                  className={`zone_tab ${activeZone === zone ? "active" : ""}`}
                  onClick={() => setActiveZone(zone)}
                >
                  Zone {zone}
                </button>
              ))}
            </div>

            <div className="zone_content">
              <button
                type="button"
                className="copy_weight_slabs_btn"
                onClick={() => {
                  const forwardSlabs =
                    rateCardFormik.values.forwardRates[activeZone] || [];
                  if (forwardSlabs.length > 0) {
                    rateCardFormik.setFieldValue(
                      `rtoRates.${activeZone}`,
                      forwardSlabs.map((slab) => ({
                        ...slab,
                        id: Date.now() + Math.random(),
                        rate: "",
                      }))
                    );
                  }
                }}
              >
                <Copy size={16} /> Copy Weight Slabs from Forward Rates
              </button>
              <p className="copy_note">
                This will copy weight ranges only. You still need to set RTO
                rates manually.
              </p>

              <div className="weight_slabs_table">
                <table>
                  <thead>
                    <tr>
                      <th>Min Weight (kg)</th>
                      <th>Max Weight (kg)</th>
                      <th>RTO Rate (₹)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateCardFormik.values.rtoRates[activeZone]?.map(
                      (slab, index) => (
                        <tr key={slab.id || index}>
                          <td>
                            <Input
                              type="number"
                              value={slab.minWeight || ""}
                              onChange={(e) =>
                                updateWeightSlab(
                                  "rto",
                                  activeZone,
                                  slab.id,
                                  "minWeight",
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              className="table_input"
                            />
                          </td>
                          <td>
                            <Input
                              type="number"
                              value={slab.maxWeight || ""}
                              onChange={(e) =>
                                updateWeightSlab(
                                  "rto",
                                  activeZone,
                                  slab.id,
                                  "maxWeight",
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              className="table_input"
                            />
                          </td>
                          <td>
                            <Input
                              type="number"
                              value={slab.rate || ""}
                              onChange={(e) =>
                                updateWeightSlab(
                                  "rto",
                                  activeZone,
                                  slab.id,
                                  "rate",
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              className="table_input"
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="delete_slab_btn"
                              onClick={() =>
                                removeWeightSlab("rto", activeZone, slab.id)
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <button
                  type="button"
                  className="add_slab_btn"
                  onClick={() => addWeightSlab("rto", activeZone)}
                >
                  <Plus size={16} /> Add Weight Slab
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="rate_card_step">
            <h5>Zone-wise Pricing Review</h5>
            <p className="step_description">
              Review the configured rates for all zones. All zones are covered
              with Forward and RTO rates.
            </p>

            <div className="zone_review_grid">
              {zones.map((zone) => {
                const forwardSlabs =
                  rateCardFormik.values.forwardRates[zone] || [];
                const rtoSlabs = rateCardFormik.values.rtoRates[zone] || [];
                const isComplete =
                  forwardSlabs.length > 0 && rtoSlabs.length > 0;

                return (
                  <div
                    key={zone}
                    className={`zone_review_card ${
                      zone === "Special" ? "special" : ""
                    }`}
                  >
                    <div className="zone_review_header">
                      <div className="zone_badge">{zone}</div>
                      {zone === "Special" && (
                        <span className="special_tag">Special</span>
                      )}
                      {isComplete && (
                        <span className="complete_badge">
                          <Check size={14} /> Complete
                        </span>
                      )}
                    </div>
                    <div className="zone_review_content">
                      <div className="rate_info">
                        <strong>Forward Rates</strong>
                        <p>
                          {forwardSlabs.length} slabs
                          {forwardSlabs.length > 0 && (
                            <>
                              <br />₹
                              {Math.min(
                                ...forwardSlabs.map(
                                  (s) => parseFloat(s.rate) || 0
                                )
                              ).toFixed(2)}{" "}
                              - ₹
                              {Math.max(
                                ...forwardSlabs.map(
                                  (s) => parseFloat(s.rate) || 0
                                )
                              ).toFixed(2)}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="rate_info">
                        <strong>RTO Rates</strong>
                        <p>
                          {rtoSlabs.length} slabs
                          {rtoSlabs.length > 0 && (
                            <>
                              <br />₹
                              {Math.min(
                                ...rtoSlabs.map((s) => parseFloat(s.rate) || 0)
                              ).toFixed(2)}{" "}
                              - ₹
                              {Math.max(
                                ...rtoSlabs.map((s) => parseFloat(s.rate) || 0)
                              ).toFixed(2)}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="success_banner">
              <Check size={20} />
              <div>
                <strong>All zones configured successfully</strong>
                <p>
                  Forward and RTO rates are set for all zones. You can proceed
                  to configure optional COD fees and additional charges.
                </p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="rate_card_step">
            <h5>COD Fees Configuration</h5>
            <p className="step_description">
              Configure Cash on Delivery (COD) fees. This is optional but if
              enabled, at least one fee type must be specified.
            </p>

            <div className="toggle_row">
              <div className="toggle_main">
                <h6>
                  Enable COD Fees
                  <br />
                  <span>Turn on to configure COD charges</span>
                </h6>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={rateCardFormik.values.codEnabled}
                    onChange={(e) =>
                      rateCardFormik.setFieldValue(
                        "codEnabled",
                        e.target.checked
                      )
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {rateCardFormik.values.codEnabled && (
              <div className="input_form_main">
                <Input
                  type="number"
                  label="Fixed COD Fee (₹)"
                  value={rateCardFormik.values.fixedCodFee || ""}
                  onChange={(e) =>
                    rateCardFormik.setFieldValue("fixedCodFee", e.target.value)
                  }
                  placeholder="0"
                />
                <span className="field_description">
                  Fixed amount charged per COD order
                </span>

                <Input
                  type="number"
                  label="Percentage COD Fee (%)"
                  value={rateCardFormik.values.percentageCodFee || ""}
                  onChange={(e) =>
                    rateCardFormik.setFieldValue(
                      "percentageCodFee",
                      e.target.value
                    )
                  }
                  placeholder="0"
                />
                <span className="field_description">
                  Percentage of order value
                </span>

                <Input
                  type="number"
                  label="Minimum COD Cap (₹)"
                  value={rateCardFormik.values.minCodCap || ""}
                  onChange={(e) =>
                    rateCardFormik.setFieldValue("minCodCap", e.target.value)
                  }
                  placeholder="0"
                />
                <span className="field_description">
                  Minimum COD fee amount
                </span>

                <Input
                  type="number"
                  label="Maximum COD Cap (₹)"
                  value={rateCardFormik.values.maxCodCap || ""}
                  onChange={(e) =>
                    rateCardFormik.setFieldValue("maxCodCap", e.target.value)
                  }
                  placeholder="0"
                />
                <span className="field_description">
                  Maximum COD fee amount
                </span>
              </div>
            )}

            {rateCardFormik.values.codEnabled && (
              <div className="example_box">
                <strong>Example:</strong> With Fixed Fee ₹20 and Percentage 2%,
                a ₹1000 COD order will incur ₹20 + ₹20 (2% of 1000) = ₹40 total
                COD fee.
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="rate_card_step">
            <h5>Additional Charges</h5>
            <p className="step_description">
              Configure additional charges like fuel surcharge, handling fees,
              etc. These charges apply after Forward and RTO calculations.
            </p>

            <div className="additional_charges_list">
              {rateCardFormik.values.additionalCharges?.map((charge, index) => (
                <div key={index} className="additional_charge_item">
                  <div className="charge_header">
                    <div className="toggle_main">
                      <h6>Enabled</h6>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={charge.enabled}
                          onChange={(e) => {
                            const updated = [
                              ...rateCardFormik.values.additionalCharges,
                            ];
                            updated[index].enabled = e.target.checked;
                            rateCardFormik.setFieldValue(
                              "additionalCharges",
                              updated
                            );
                          }}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <button
                      type="button"
                      className="delete_charge_btn"
                      onClick={() => removeAdditionalCharge(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="input_form_main">
                    <Input
                      type="text"
                      label="Charge Name"
                      placeholder="e.g., Fuel Surcharge"
                      value={charge.chargeName || ""}
                      onChange={(e) => {
                        const updated = [
                          ...rateCardFormik.values.additionalCharges,
                        ];
                        updated[index].chargeName = e.target.value;
                        rateCardFormik.setFieldValue(
                          "additionalCharges",
                          updated
                        );
                      }}
                    />

                    <div className="input_main">
                      <label>Type</label>
                      <Select
                        options={[
                          { value: "fixed", label: "Fixed (₹)" },
                          { value: "percentage", label: "Percentage (%)" },
                        ]}
                        value={{
                          value: charge.type,
                          label:
                            charge.type === "fixed"
                              ? "Fixed (₹)"
                              : "Percentage (%)",
                        }}
                        onChange={(option) => {
                          const updated = [
                            ...rateCardFormik.values.additionalCharges,
                          ];
                          updated[index].type = option.value;
                          rateCardFormik.setFieldValue(
                            "additionalCharges",
                            updated
                          );
                        }}
                        className="option_select"
                        isSearchable={false}
                      />
                    </div>

                    <Input
                      type="number"
                      label={`Value (${charge.type === "fixed" ? "₹" : "%"})`}
                      value={charge.value || ""}
                      onChange={(e) => {
                        const updated = [
                          ...rateCardFormik.values.additionalCharges,
                        ];
                        updated[index].value = e.target.value;
                        rateCardFormik.setFieldValue(
                          "additionalCharges",
                          updated
                        );
                      }}
                      placeholder="0.00"
                    />

                    <div className="input_main">
                      <label>Applies On</label>
                      <Select
                        options={[
                          { value: "forward", label: "Forward" },
                          { value: "rto", label: "RTO" },
                          { value: "both", label: "Both" },
                        ]}
                        value={{
                          value: charge.appliesOn,
                          label:
                            charge.appliesOn === "forward"
                              ? "Forward"
                              : charge.appliesOn === "rto"
                              ? "RTO"
                              : "Both",
                        }}
                        onChange={(option) => {
                          const updated = [
                            ...rateCardFormik.values.additionalCharges,
                          ];
                          updated[index].appliesOn = option.value;
                          rateCardFormik.setFieldValue(
                            "additionalCharges",
                            updated
                          );
                        }}
                        className="option_select"
                        isSearchable={false}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="add_charge_btn"
              onClick={addAdditionalCharge}
            >
              <Plus size={16} /> Add Charge
            </button>
          </div>
        );

      case 7:
        return (
          <div className="rate_card_step">
            <h5>Review & Save</h5>
            <p className="step_description">
              Review all configurations before saving the rate card.
            </p>

            <div className="review_section">
              <div className="review_item">
                <div className="review_header">
                  <Check size={16} />
                  <h6>Courier Details</h6>
                </div>
                <div className="review_content">
                  <p>
                    <strong>Courier Partner:</strong>{" "}
                    {rateCardFormik.values.courierPartner?.label || "N/A"}
                  </p>
                  <p>
                    <strong>Mode:</strong>{" "}
                    {rateCardFormik.values.courierMode === "surface"
                      ? "Surface"
                      : "Air"}
                  </p>
                  <p>
                    <strong>Rate Card Name:</strong>{" "}
                    {rateCardFormik.values.rateCardName || "N/A"}
                  </p>
                </div>
              </div>

              <div className="review_item">
                <div className="review_header">
                  <Check size={16} />
                  <h6>Forward & RTO Rates</h6>
                </div>
                <div className="review_content">
                  <div className="zone_review_grid">
                    {zones.map((zone) => {
                      const forwardSlabs =
                        rateCardFormik.values.forwardRates[zone] || [];
                      const rtoSlabs =
                        rateCardFormik.values.rtoRates[zone] || [];
                      return (
                        <div
                          key={zone}
                          className={`zone_review_card ${
                            zone === "Special" ? "special" : ""
                          }`}
                        >
                          <div className="zone_review_header">
                            <div className="zone_badge">{zone}</div>
                            {zone === "Special" && (
                              <span className="special_tag">Special</span>
                            )}
                          </div>
                          <div className="zone_review_content">
                            <div className="rate_info">
                              <strong>Forward:</strong> {forwardSlabs.length}{" "}
                              slabs
                            </div>
                            <div className="rate_info">
                              <strong>RTO:</strong> {rtoSlabs.length} slabs
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="review_item">
                <div className="review_header">
                  <Check size={16} />
                  <h6>COD Fees</h6>
                </div>
                <div className="review_content">
                  <p>
                    <strong>Fixed Fee:</strong> ₹
                    {rateCardFormik.values.fixedCodFee || "0.00"}
                  </p>
                  <p>
                    <strong>Percentage Fee:</strong>{" "}
                    {rateCardFormik.values.percentageCodFee || "0"}%
                  </p>
                  <p>
                    <strong>Min Cap:</strong> ₹
                    {rateCardFormik.values.minCodCap || "0.00"}
                  </p>
                  <p>
                    <strong>Max Cap:</strong> ₹
                    {rateCardFormik.values.maxCodCap || "0.00"}
                  </p>
                </div>
              </div>

              <div className="review_item">
                <div className="review_header">
                  <Check size={16} />
                  <h6>Additional Charges</h6>
                </div>
                <div className="review_content">
                  {rateCardFormik.values.additionalCharges?.map(
                    (charge, index) => (
                      <p key={index}>
                        {charge.chargeName || "Unnamed Charge"} -{" "}
                        {charge.type === "fixed" ? "₹" : ""}
                        {charge.value}
                        {charge.type === "percentage" ? "%" : ""} - Applies on:{" "}
                        {charge.appliesOn === "forward"
                          ? "Forward"
                          : charge.appliesOn === "rto"
                          ? "RTO"
                          : "Both"}
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="shipment_section">
        <div className="page_header">
          <h1>Settings</h1>
        </div>
        <div className="superadmin_settings_main">
          <div className="setting_scroll">
            <ul className="nav nav-pills">
              {tabs.map((tab) => (
                <li key={tab.id} className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="tab-content">
            <form onSubmit={handleSubmit}>
              {/* User Tab */}
              {activeTab === "user" && (
                <div className="form_main">
                  <h5>User Management</h5>

                  <div className="input_form_main">
                    <div className="input_main">
                      <label>Maximum Users</label>
                      <input
                        type="number"
                        value={formData.maxUsers}
                        onChange={(e) =>
                          handleInputChange("maxUsers", e.target.value)
                        }
                        placeholder="100"
                      />
                    </div>

                    <div className="input_main">
                      <label>Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={formData.sessionTimeout}
                        onChange={(e) =>
                          handleInputChange("sessionTimeout", e.target.value)
                        }
                        placeholder="30"
                      />
                    </div>
                  </div>

                  <div className="option_select">
                    <div className="input_main">
                      <label>Password Policy</label>
                      <select
                        value={formData.passwordPolicy}
                        onChange={(e) =>
                          handleInputChange("passwordPolicy", e.target.value)
                        }
                        className="form-control"
                      >
                        <option value="basic">Basic (6+ characters)</option>
                        <option value="medium">
                          Medium (8+ chars, 1 number)
                        </option>
                        <option value="strong">
                          Strong (8+ chars, 1 number, 1 special)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="toggle_row">
                    <div className="toggle_main">
                      <h6>Enable User Registration</h6>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={formData.userRegistrationEnabled}
                          onChange={(e) =>
                            handleInputChange(
                              "userRegistrationEnabled",
                              e.target.checked
                            )
                          }
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Tab */}
              {activeTab === "notification" && (
                <div className="form_main">
                  <h5>Notification Channels</h5>

                  <div className="notification_settings">
                    <div className="notification_block">
                      <h6>Email Notifications</h6>
                      <p>Send notifications via email</p>
                      <div className="channel_buttons">
                        <div className="channel_option">
                          <input
                            type="checkbox"
                            checked={formData.emailNotifications}
                            onChange={(e) =>
                              handleInputChange(
                                "emailNotifications",
                                e.target.checked
                              )
                            }
                          />
                          <span>Enable Email</span>
                        </div>
                      </div>
                    </div>

                    <div className="notification_block">
                      <h6>SMS Notifications</h6>
                      <p>Send notifications via SMS</p>
                      <div className="channel_buttons">
                        <div className="channel_option">
                          <input
                            type="checkbox"
                            checked={formData.smsNotifications}
                            onChange={(e) =>
                              handleInputChange(
                                "smsNotifications",
                                e.target.checked
                              )
                            }
                          />
                          <span>Enable SMS</span>
                        </div>
                      </div>
                    </div>

                    <div className="notification_block">
                      <h6>Push Notifications</h6>
                      <p>Send browser push notifications</p>
                      <div className="channel_buttons">
                        <div className="channel_option">
                          <input
                            type="checkbox"
                            checked={formData.pushNotifications}
                            onChange={(e) =>
                              handleInputChange(
                                "pushNotifications",
                                e.target.checked
                              )
                            }
                          />
                          <span>Enable Push</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h5>Notification Preferences</h5>

                  <div className="input_form_main">
                    <div className="input_main">
                      <label>Admin Email</label>
                      <input
                        type="email"
                        value={formData.adminEmail}
                        onChange={(e) =>
                          handleInputChange("adminEmail", e.target.value)
                        }
                        placeholder="admin@example.com"
                      />
                    </div>

                    <div className="option_select">
                      <div className="input_main">
                        <label>Notification Frequency</label>
                        <select
                          value={formData.notificationFrequency}
                          onChange={(e) =>
                            handleInputChange(
                              "notificationFrequency",
                              e.target.value
                            )
                          }
                          className="form-control"
                        >
                          <option value="immediate">Immediate</option>
                          <option value="hourly">Hourly Digest</option>
                          <option value="daily">Daily Digest</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <h5>Notification Types</h5>

                  <div className="notification_settings">
                    <div className="notification_block">
                      <h6>Order Updates</h6>
                      <p>Notifications for order status changes</p>
                      <div className="channel_buttons">
                        <div className="channel_option">
                          <input
                            type="checkbox"
                            checked={formData.notificationChannels.orderUpdates}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "notificationChannels",
                                "orderUpdates",
                                e.target.checked
                              )
                            }
                          />
                          <span>Enable</span>
                        </div>
                      </div>
                    </div>

                    <div className="notification_block">
                      <h6>System Alerts</h6>
                      <p>Notifications for system maintenance and updates</p>
                      <div className="channel_buttons">
                        <div className="channel_option">
                          <input
                            type="checkbox"
                            checked={formData.notificationChannels.systemAlerts}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "notificationChannels",
                                "systemAlerts",
                                e.target.checked
                              )
                            }
                          />
                          <span>Enable</span>
                        </div>
                      </div>
                    </div>

                    <div className="notification_block">
                      <h6>User Activity</h6>
                      <p>Notifications for user login and activity</p>
                      <div className="channel_buttons">
                        <div className="channel_option">
                          <input
                            type="checkbox"
                            checked={formData.notificationChannels.userActivity}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "notificationChannels",
                                "userActivity",
                                e.target.checked
                              )
                            }
                          />
                          <span>Enable</span>
                        </div>
                      </div>
                    </div>

                    <div className="notification_block">
                      <h6>Security Alerts</h6>
                      <p>Notifications for security events and breaches</p>
                      <div className="channel_buttons">
                        <div className="channel_option">
                          <input
                            type="checkbox"
                            checked={
                              formData.notificationChannels.securityAlerts
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "notificationChannels",
                                "securityAlerts",
                                e.target.checked
                              )
                            }
                          />
                          <span>Enable</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* {activeTab === "rateCard" && (
                <div className="rate_card_wizard">
                  <div className="wizard_header">
                    <h5>Create Rate Card</h5>
                    <p className="wizard_subtitle">
                      Configure courier-wise pricing with mandatory Forward and
                      RTO rates
                    </p>
                  </div>

                  <div className="wizard_stepper">
                    {steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`stepper_step ${
                          currentStep === step.id ? "active" : ""
                        } ${
                          completedSteps.includes(step.id) ? "completed" : ""
                        }`}
                      >
                        <div className="step_indicator">
                          {completedSteps.includes(step.id) ? (
                            <Check size={16} />
                          ) : (
                            <span>{step.id}</span>
                          )}
                        </div>
                        <div className="step_label">
                          {step.label}
                          {step.required && (
                            <span className="required_label">Required</span>
                          )}
                        </div>
                        {index < steps.length - 1 && (
                          <div className="step_connector"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="wizard_content">{renderStepContent()}</div>

                  <div className="wizard_actions">
                    {currentStep > 1 && (
                      <RippleButton
                        type="button"
                        className="wizard_btn_prev"
                        onClick={handlePrevious}
                      >
                        ← Previous
                      </RippleButton>
                    )}
                    {currentStep < 7 ? (
                      <RippleButton
                        type="button"
                        className="wizard_btn_next"
                        onClick={handleNext}
                      >
                        Next: {steps[currentStep]?.label}
                      </RippleButton>
                    ) : (
                      <RippleButton
                        type="button"
                        className="wizard_btn_save"
                        onClick={rateCardFormik.handleSubmit}
                        disabled={isSavingRateCard}
                      >
                        <Check size={16} />{" "}
                        {isSavingRateCard ? "Saving..." : "Save Rate Card"}
                      </RippleButton>
                    )}
                  </div>
                </div>
              )} */}

              {activeTab !== "rateCard" && (
                <div className="submit_button">
                  <button type="submit">Save Settings</button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminSettings;
