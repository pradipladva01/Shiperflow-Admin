import React, { useState } from "react";
import RippleButton from "../RippleButton";
import { Trash2, Pencil } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import RecipientModal from "./RecipientModal";
import { toast } from "react-toastify";

const notificationTypes = {
  order: [
    { title: "New Order Received", description: "When a new order is placed" },
    { title: "Order Shipped", description: "When an order is dispatched" },
    { title: "Order Delivered", description: "When an order is delivered" },
  ],
  payout: [
    { title: "Payout Initiated", description: "When your payout is initiated" },
    { title: "Payout Completed", description: "When the payout is credited" },
  ],
  shipping: [
    { title: "Shipping Delayed", description: "When delivery is delayed" },
  ],
  ndr: [
    { title: "NDR Raised", description: "When NDR is raised" },
    { title: "NDR Resolved", description: "When NDR is resolved" },
  ],
};

const recipientsDummy = [
  {
    id: 1,
    name: "Main Contact",
    email: "contact@yourbusiness.com",
    phone: "9876543210",
    channels: ["Email", "SMS", "WhatsApp"],
  },
  {
    id: 2,
    name: "Operations Team",
    email: "ops@yourbusiness.com",
    channels: ["Email"],
  },
  {
    id: 3,
    name: "Pradip",
    email: "pradip@gmail.com",
    phone: "8585258285",
    channels: ["Email", "SMS", "WhatsApp"],
  },
];

const NotificationsForm = () => {
  const [activeTab, setActiveTab] = useState("order");
  const [recipients, setRecipients] = useState(recipientsDummy);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState(null);

  const tabs = [
    { key: "order", label: "Order Status" },
    { key: "payout", label: "Payouts" },
    { key: "shipping", label: "Shipping" },
    { key: "ndr", label: "NDR" },
  ];

  const handleTabClick = (key) => setActiveTab(key);

  const initialValues = {
    channels: Object.values(notificationTypes)
      .flat()
      .reduce((acc, item) => {
        acc[item.title] = [];
        return acc;
      }, {}),
  };

  const getValidationSchema = (tabKey) => {
    const fields = notificationTypes[tabKey] || [];

    return Yup.object().shape({
      channels: Yup.object().shape(
        fields.reduce((acc, item) => {
          acc[item.title] = Yup.array()
            .min(1, "Select at least one channel")
            .required("Required");
          return acc;
        }, {})
      ),
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema: getValidationSchema(activeTab),
    enableReinitialize: true,
    onSubmit: (values) => {
      const groupedByTab = {};
      for (const tab in notificationTypes) {
        groupedByTab[tab] = {};

        notificationTypes[tab].forEach((n) => {
          groupedByTab[tab][n.title] = values.channels[n.title] || [];
        });
      }

      // Grouped by Tab
      toast.success("Changes saved successfully!");
    },
  });

  const toggleChannel = (notificationTitle, channel) => {
    const currentChannels = formik.values.channels[notificationTitle] || [];
    const updated = currentChannels.includes(channel)
      ? currentChannels.filter((ch) => ch !== channel)
      : [...currentChannels, channel];

    formik.setFieldValue(`channels.${notificationTitle}`, updated);
  };

  const openAddModal = () => {
    setEditingRecipient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (recipient) => {
    setEditingRecipient(recipient);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSaveRecipient = (data) => {
    if (editingRecipient) {
      // Edit
      setRecipients((prev) =>
        prev.map((r) => (r.id === editingRecipient.id ? { ...r, ...data } : r))
      );
    } else {
      // Add
      const newRecipient = { ...data, id: Date.now() };
      setRecipients((prev) => [...prev, newRecipient]);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <form className="form_main" onSubmit={formik.handleSubmit}>
        <h5>Notification Preferences</h5>

        <ul className="nav nav-pills mb-3" role="tablist">
          {tabs.map((tab) => (
            <li className="nav-item" role="presentation" key={tab.key}>
              <button
                className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                type="button"
                role="tab"
                onClick={() => handleTabClick(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          <div className="tab-pane fade show active">
            {notificationTypes[activeTab]?.map((n, i) => (
              <div key={i} className="notification_card">
                <div className="title">
                  <h6>{n.title}</h6>
                  <p>{n.description}</p>
                </div>
                <div className="toggle_group">
                  {["Email", "SMS", "WhatsApp"].map((channel) => (
                    <div className="form-check" key={channel}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`${n.title}-${channel}`}
                        checked={
                          formik.values.channels[n.title]?.includes(channel) ||
                          false
                        }
                        onChange={() => toggleChannel(n.title, channel)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`${n.title}-${channel}`}
                      >
                        {channel}
                      </label>
                    </div>
                  ))}
                  {formik.errors.channels?.[n.title] &&
                    formik.touched.channels?.[n.title] && (
                      <div className="error">
                        {formik.errors.channels[n.title]}
                      </div>
                    )}
                </div>
              </div>
            ))}
            {notificationTypes[activeTab]?.length === 0 && (
              <p>No notification settings for this tab.</p>
            )}
          </div>
        </div>

        <div className="recipients_section">
          <div className="main_title">
            <div className="left">
              <h5>Additional Recipients</h5>
              <p>Add team members who should also receive notifications</p>
            </div>
            <RippleButton
              type="button"
              className="add_location_btn"
              onClick={openAddModal}
            >
              + Add Recipient
            </RippleButton>
          </div>

          {recipients.map((r) => (
            <div key={r.id} className="recipient_card">
              <div>
                <strong>{r.name}</strong>
                <p>Email: {r.email}</p>
                {r.phone && <p>Phone: {r.phone}</p>}
                <div className="channel_badges">
                  {r.channels.map((ch) => (
                    <span key={ch} className="badge">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
              <div className="recipient_actions">
                <RippleButton
                  type="button"
                  className="edit_btn"
                  onClick={() => openEditModal(r)}
                >
                  <Pencil size={16} />
                </RippleButton>
                <RippleButton
                  type="button"
                  className="delete_btn"
                  onClick={() => handleDelete(r.id)}
                >
                  <Trash2 size={16} />
                </RippleButton>
              </div>
            </div>
          ))}
        </div>

        <div className="submit_button mt-4">
          <RippleButton type="submit">Save Notification Settings</RippleButton>
        </div>
      </form>
      <RecipientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecipient}
        initialData={editingRecipient}
      />
    </>
  );
};

export default NotificationsForm;
