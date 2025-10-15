import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Select from "react-select";
import RippleButton from "../RippleButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import PickupLocationModal from "../PickupLocationModal";
import { toast } from "react-toastify";

const courierOptions = [
  { value: "cheapest", label: "Cheapest Option" },
  { value: "fastest", label: "Fastest Option" },
];

const initialPickupLocations = [
  {
    id: 1,
    locationName: "Main Warehouse",
    contactPerson: "John Smith",
    phoneNumber: "9876543210",
    address: "123 Shipping Lane",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "400001",
    isDefault: true,
  },
  {
    id: 2,
    locationName: "Secondary Location",
    contactPerson: "Jane Doe",
    phoneNumber: "8765432109",
    address: "456 Delivery Road",
    city: "Delhi",
    state: "Delhi",
    pinCode: "110001",
    isDefault: false,
  },
];

const ShippingForm = () => {

  const [pickupLocations, setPickupLocations] = useState(
    initialPickupLocations
  );
  const [selectedPickup, setSelectedPickup] = useState(
    initialPickupLocations[0]
  );
  const [codEnabled, setCodEnabled] = useState(true);
  const [autoAssign, setAutoAssign] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editLocation, setEditLocation] = useState(null);

  const pickupOptions = pickupLocations.map((loc) => ({
    label: `${loc.locationName} - ${loc.city}, ${loc.state}`,
    value: loc,
  }));

  const formik = useFormik({
    initialValues: {
      courierPriority: courierOptions[0],
      packageDims: {
        length: 30,
        width: 20,
        height: 10,
        volumetricWeight: 0,
        deadWeight: 0.5,
      },
    },
    validationSchema: Yup.object({
      courierPriority: Yup.object().required("Courier priority is required"),
      packageDims: Yup.object({
        length: Yup.number().required("Required"),
        width: Yup.number().required("Required"),
        height: Yup.number().required("Required"),
        volumetricWeight: Yup.number().required("Required"),
        deadWeight: Yup.number().required("Required"),
      }),
    }),
    onSubmit: (values) => {
      console.log("Shipping Settings:", {
        pickupLocations,
        selectedPickup,
        codEnabled,
        autoAssign,
        ...values,
      });
      toast.success("Changes saved successfully!");
    },
  });

  const isChanged =
    formik.dirty ||
    selectedPickup?.id !== initialPickupLocations[0].id ||
    codEnabled !== true ||
    autoAssign !== true;

  const { length, width, height } = formik.values.packageDims;

  useEffect(() => {
    if (length && width && height) {
      const volumetricWeight = Number(
        ((length * width * height) / 5000).toFixed(2)
      );
      formik.setFieldValue("packageDims.volumetricWeight", volumetricWeight);
    }
  }, [length, width, height]);

  const handleSavePickup = (data) => {
    let updatedLocations;
    const isNew = !editLocation;
    const newId = isNew ? Date.now() : editLocation.id;
    const finalData = { ...data, id: newId };

    if (editLocation) {
      updatedLocations = pickupLocations.map((loc) =>
        loc.id === editLocation.id ? finalData : loc
      );
    } else {
      updatedLocations = [...pickupLocations, finalData];
    }

    if (finalData.isDefault) {
      updatedLocations = updatedLocations.map((loc) => ({
        ...loc,
        isDefault: loc.id === finalData.id,
      }));
    }

    updatedLocations.sort(
      (a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)
    );
    setPickupLocations(updatedLocations);

    const newSelected =
      updatedLocations.find((loc) => loc.isDefault) || updatedLocations[0];
    setSelectedPickup(newSelected);
    setEditLocation(null);
    setShowModal(false);
  };

  const renderError = (field) => {
    const parts = field.split(".");
    const error = parts.reduce((acc, part) => acc?.[part], formik.errors);
    const touched = parts.reduce((acc, part) => acc?.[part], formik.touched);
    return touched && error ? <div className="error">{error}</div> : null;
  };

  return (
    <>
      <form className="form_main" onSubmit={formik.handleSubmit} noValidate>
        <h5>Pickup Locations</h5>
        <div className="input_main">
          <label className="form-label">
            Default Pickup Address <span>*</span>
          </label>
          <Select
            className="option_select"
            options={pickupOptions}
            value={
              selectedPickup
                ? pickupOptions.find(
                    (opt) => opt.value.id === selectedPickup.id
                  )
                : null
            }
            onChange={(selected) => setSelectedPickup(selected.value)}
          />
        </div>

        <div className="pickup_list_main">
          <div className="pickup_list">
            {pickupLocations.map((loc) => (
              <div key={loc.id} className="pickup_card">
                <div className="pickup_info">
                  <h6>
                    {loc.locationName}
                    {loc.isDefault && (
                      <span className="default_tag">Default</span>
                    )}
                  </h6>
                  <p>
                    {loc.contactPerson}, {loc.phoneNumber}
                  </p>
                  <p>
                    {loc.address}, {loc.city}, {loc.state} - {loc.pinCode}
                  </p>
                </div>
                <div className="pickup_actions">
                  <RippleButton
                    type="button"
                    className="edit_btn"
                    onClick={() => {
                      setEditLocation(loc);
                      setShowModal(true);
                    }}
                  >
                    <Pencil size={16} />
                  </RippleButton>
                  <RippleButton
                    type="button"
                    className="delete_btn"
                    onClick={() => {
                      setPickupLocations(
                        pickupLocations.filter((l) => l.id !== loc.id)
                      );
                    }}
                  >
                    <Trash2 size={16} />
                  </RippleButton>
                </div>
              </div>
            ))}
          </div>
          <RippleButton
            type="button"
            className="add_location_btn"
            onClick={() => {
              setEditLocation(null);
              setShowModal(true);
            }}
          >
            + Add Pickup Location
          </RippleButton>
        </div>

        <div className="default_package">
          <h5>Default Package Dimensions</h5>
          <div className="dimension_row">
            {["length", "width", "height"].map((dim) => (
              <div key={dim} className="input_main">
                <label className="form-label">
                  {dim.charAt(0).toUpperCase() + dim.slice(1)} (cm){" "}
                  <span>*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name={`packageDims.${dim}`}
                  value={formik.values.packageDims[dim]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {renderError(`packageDims.${dim}`)}
              </div>
            ))}

            {/* Volumetric Weight (auto-calculated) */}
            <div className="input_main">
              <label className="form-label">Volumetric Weight (kg)</label>
              <input
                type="number"
                className="form-control"
                name="packageDims.volumetricWeight"
                value={formik.values.packageDims.volumetricWeight}
                disabled
              />
            </div>

            {/* Dead Weight (manual) */}
            <div className="input_main">
              <label className="form-label">
                Dead Weight (kg) <span>*</span>
              </label>
              <input
                type="number"
                className="form-control"
                name="packageDims.deadWeight"
                value={formik.values.packageDims.deadWeight}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {renderError("packageDims.deadWeight")}
            </div>
          </div>
        </div>

        <div className="courier_preferences">
          <h5>Courier Preferences</h5>
          <div className="input_main">
            <label className="form-label">
              Courier Priority <span>*</span>
            </label>
            <Select
              options={courierOptions}
              value={formik.values.courierPriority}
              onChange={(opt) => formik.setFieldValue("courierPriority", opt)}
              className="option_select"
              placeholder="Select priority"
              onBlur={() => formik.setFieldTouched("courierPriority", true)}
            />
            {renderError("courierPriority")}
          </div>
          <div className="toggle_row">
            <div className="toggle_main">
              <h6>
                Allow COD (Cash on Delivery)
                <br />
                <span>Enable cash on delivery option for your orders</span>
              </h6>
              <label class="switch">
                <input
                  type="checkbox"
                  checked={codEnabled}
                  onChange={() => setCodEnabled(!codEnabled)}
                />
                <span class="slider"></span>
              </label>
            </div>
            <div className="toggle_main">
              <h6>
                Auto Courier Assignment
                <br />
                <span>Automatically assign best courier based on priority</span>
              </h6>
              <label class="switch">
                <input
                  type="checkbox"
                  checked={autoAssign}
                  onChange={() => setAutoAssign(!autoAssign)}
                />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="submit_button">
          <RippleButton type="submit" disabled={!isChanged || !formik.isValid}>
            Save Shipping Settings
          </RippleButton>
        </div>
      </form>

      <PickupLocationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditLocation(null);
        }}
        onSave={handleSavePickup}
        initialData={editLocation}
      />
    </>
  );
};

export default ShippingForm;
