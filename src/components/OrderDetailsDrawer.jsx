import React, { useState } from "react";
import {
  X,
  Download,
  FileText,
  Edit3,
  Package,
  MapPin,
  User,
  Phone,
  CreditCard,
  Truck,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Select from "react-select";
import RippleButton from "./RippleButton";

const OrderDetailsDrawer = ({
  isOpen,
  onClose,
  orderData,
  onStatusChange,
  onAddNote,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showStatusSelect, setShowStatusSelect] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Notes state
  const [noteText, setNoteText] = useState("");
  const [escalateText, setEscalateText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isEscalating, setIsEscalating] = useState(false);
  const [noteMessage, setNoteMessage] = useState(null);
  const [existingNotes, setExistingNotes] = useState([
    {
      id: 1,
      type: "note",
      content: "Customer requested delivery after 6 PM",
      author: "System",
      timestamp: "Oct 01, 23:30",
    },
  ]);

  // Order data received

  // Status options for the dropdown
  const statusOptions = [
    { value: "booked", label: "Booked" },
    { value: "pending_pickup", label: "Pending Pickup" },
    { value: "in_transit", label: "In Transit" },
    { value: "out_for_delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "lost", label: "Lost" },
    { value: "damaged", label: "Damaged" },
  ];

  if (!isOpen || !orderData) return null;

  const tabs = [
    { key: "overview", label: "Overview", icon: Package },
    { key: "tracking", label: "Tracking", icon: MapPin },
    { key: "items", label: "Items", icon: Package },
    { key: "audit", label: "Audit", icon: FileText },
    { key: "notes", label: "Notes", icon: Edit3 },
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      new: "#10b981",
      booked: "#3b82f6",
      picked_up: "#8b5cf6",
      in_transit: "#f59e0b",
      out_for_delivery: "#ef4444",
      delivered: "#10b981",
      cancelled: "#6b7280",
      rto: "#f97316",
      rto_damaged: "#dc2626",
    };
    return statusColors[status?.toLowerCase()] || "#6b7280";
  };

  const getStatusBadge = (status) => {
    return (
      <span className="status_badge">
        {status?.replace(/_/g, " ") || "Unknown"}
      </span>
    );
  };

  return (
    <>
      {isOpen && <div className="drawer_backdrop show" onClick={onClose} />}
      <div className={`order_details_drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer_header">
          <div className="order_info">
            <div className="order_id_section">
              <h3>{orderData.id}</h3>
              <div className="order_meta">
                <span className="awb">AWB: {orderData.awb || "N/A"}</span>
                <span className="updated">
                  Updated:{" "}
                  {new Date(orderData.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <div className="order_status">
              {getStatusBadge(orderData.status)}
              <RippleButton className="close_btn" onClick={onClose}>
                <X size={20} />
              </RippleButton>
            </div>
          </div>
        </div>

        <div className="drawer_tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <RippleButton
                key={tab.key}
                className={`tab_btn ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <Icon size={16} />
                {tab.label}
              </RippleButton>
            );
          })}
        </div>

        <div className="drawer_content">
          {activeTab === "overview" && (
            <div className="overview_content">
              <div className="quick_actions">
                <h4>Quick Actions</h4>
                <div className="action_buttons">
                  <RippleButton className="action_btn secondary">
                    <Download size={16} />
                    Download Label
                  </RippleButton>
                  <RippleButton className="action_btn secondary">
                    <FileText size={16} />
                    Invoice
                  </RippleButton>
                  <RippleButton
                    className="action_btn secondary"
                    onClick={() => setShowStatusSelect(!showStatusSelect)}
                  >
                    <Edit3 size={16} />
                    Change Status
                  </RippleButton>
                </div>
                {showStatusSelect && (
                  <div className="status_change_section">
                    <label className="status_label">Select new status</label>
                    <Select
                      options={statusOptions}
                      value={selectedStatus}
                      onChange={(option) => setSelectedStatus(option)}
                      placeholder="Choose status..."
                      className="option_select"
                      isSearchable={false}
                      menuPlacement="bottom"
                    />
                    <div className="status_action_buttons">
                      <RippleButton
                        className="status_btn secondary"
                        onClick={() => {
                          setShowStatusSelect(false);
                          setSelectedStatus(null);
                        }}
                      >
                        Close
                      </RippleButton>
                      <RippleButton
                        className="status_btn primary"
                        onClick={async () => {
                          if (selectedStatus) {
                            setIsSavingStatus(true);
                            setStatusMessage(null);

                            try {
                              // Call the parent component's status change handler
                              if (onStatusChange) {
                                await onStatusChange(
                                  orderData.id,
                                  selectedStatus.value
                                );
                                setStatusMessage({
                                  type: "success",
                                  text: `Status changed to ${selectedStatus.label} successfully!`,
                                });

                                // Clear the form
                                setShowStatusSelect(false);
                                setSelectedStatus(null);

                                // Clear message after 3 seconds
                                setTimeout(() => setStatusMessage(null), 3000);
                              }
                            } catch (error) {
                              setStatusMessage({
                                type: "error",
                                text: "Failed to update status. Please try again.",
                              });
                              setTimeout(() => setStatusMessage(null), 3000);
                            } finally {
                              setIsSavingStatus(false);
                            }
                          }
                        }}
                        disabled={!selectedStatus || isSavingStatus}
                      >
                        {isSavingStatus ? "Saving..." : "Save"}
                      </RippleButton>
                    </div>
                  </div>
                )}

                {/* Status Message */}
                {statusMessage && (
                  <div className={`status_message ${statusMessage.type}`}>
                    {statusMessage.type === "success" ? (
                      <CheckCircle size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    <span>{statusMessage.text}</span>
                  </div>
                )}
              </div>

              <div className="detail_card">
                <h4>Customer Details</h4>
                <div className="detail_item">
                  <User size={16} />
                  <div>
                    <span className="label">Name:</span>
                    <span className="value">{orderData.customer}</span>
                  </div>
                </div>
                <div className="detail_item">
                  <Phone size={16} />
                  <div>
                    <span className="label">Phone:</span>
                    <span className="value">{orderData.phone || "N/A"}</span>
                  </div>
                </div>
                <div className="detail_item">
                  <MapPin size={16} />
                  <div>
                    <span className="label">Address:</span>
                    <span className="value">{orderData.address || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="detail_card">
                <h4>Order Details</h4>
                <div className="detail_item">
                  <Package size={16} />
                  <div>
                    <span className="label">Merchant:</span>
                    <span className="value">{orderData.channel}</span>
                  </div>
                </div>
                <div className="detail_item">
                  <CreditCard size={16} />
                  <div>
                    <span className="label">Amount:</span>
                    <span className="value">
                      ₹{orderData.collectableAmount}
                    </span>
                  </div>
                </div>
                <div className="detail_item">
                  <CreditCard size={16} />
                  <div>
                    <span className="label">Payment:</span>
                    <span className="value">{orderData.method}</span>
                  </div>
                </div>
                <div className="detail_item">
                  <Package size={16} />
                  <div>
                    <span className="label">Weight:</span>
                    <span className="value">{orderData.weight}</span>
                  </div>
                </div>
              </div>

              <div className="detail_card">
                <h4>Logistics</h4>
                <div className="detail_item">
                  <Truck size={16} />
                  <div>
                    <span className="label">Courier:</span>
                    <span className="value">{orderData.courier || "N/A"}</span>
                  </div>
                </div>
                <div className="detail_item">
                  <FileText size={16} />
                  <div>
                    <span className="label">AWB:</span>
                    <span className="value">{orderData.awb || "N/A"}</span>
                  </div>
                </div>
                <div className="detail_item">
                  <Calendar size={16} />
                  <div>
                    <span className="label">Created:</span>
                    <span className="value">
                      {new Date(orderData.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tracking" && (
            <div className="tracking_content">
              <h4>Tracking Timeline</h4>
              <div className="timeline">
                <div className="timeline_item active">
                  <div className="timeline_dot"></div>
                  <div className="timeline_content">
                    <h5>Order Placed</h5>
                    <p>Order has been placed successfully</p>
                    <span className="timeline_date">
                      {new Date(orderData.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <div className="timeline_item">
                  <div className="timeline_dot"></div>
                  <div className="timeline_content">
                    <h5>Picked Up</h5>
                    <p>Package picked up from merchant</p>
                    <span className="timeline_date">Sep 30, 23:30</span>
                  </div>
                </div>
                <div className="timeline_item">
                  <div className="timeline_dot"></div>
                  <div className="timeline_content">
                    <h5>In Transit</h5>
                    <p>Package is on the way to destination</p>
                    <span className="timeline_date">Oct 01, 10:30</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "items" && (
            <div className="items_content">
              <h4>Order Items</h4>
              <div className="item_card">
                <div className="item_image">
                  <Package size={24} />
                </div>
                <div className="item_details">
                  <h5>{orderData.product}</h5>
                  <p>SKU: {orderData.sku || "N/A"}</p>
                  <p>
                    Qty: {orderData.quantity || 1} • Weight: {orderData.weight}
                  </p>
                </div>
                <div className="item_price">
                  <span>₹{orderData.collectableAmount}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="audit_content">
              <h4>Audit Trail</h4>
              <div className="audit_timeline">
                <div className="audit_item">
                  <div className="audit_content">
                    <h5>Order created by merchant</h5>
                    <p>by System</p>
                    <span className="audit_date">Sep 23, 23:30</span>
                  </div>
                </div>
                <div className="audit_item">
                  <div className="audit_content">
                    <h5>
                      Status changed to {orderData.status?.replace(/_/g, " ")}
                    </h5>
                    <p>by Admin</p>
                    <span className="audit_date">Oct 01, 23:30</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="notes_content">
              <h4>Order Notes</h4>

              {/* Add Note Section */}
              <div className="add_note_section">
                <textarea
                  placeholder="Add a note about this order..."
                  className="note_textarea"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <RippleButton
                  className="add_note_btn"
                  onClick={async () => {
                    if (!noteText.trim()) return;

                    setIsAddingNote(true);
                    setNoteMessage(null);

                    try {
                      const newNote = {
                        id: Date.now(),
                        type: "note",
                        content: noteText.trim(),
                        author: "Admin",
                        timestamp: new Date().toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      };

                      setExistingNotes((prev) => [newNote, ...prev]);

                      if (onAddNote) {
                        await onAddNote(orderData.id, "note", noteText.trim());
                      }

                      setNoteMessage({
                        type: "success",
                        text: "Note added successfully!",
                      });

                      setNoteText("");
                      setTimeout(() => setNoteMessage(null), 3000);
                    } catch (error) {
                      setNoteMessage({
                        type: "error",
                        text: "Failed to add note. Please try again.",
                      });
                      setTimeout(() => setNoteMessage(null), 3000);
                    } finally {
                      setIsAddingNote(false);
                    }
                  }}
                  disabled={!noteText.trim() || isAddingNote}
                >
                  <Edit3 size={16} />
                  {isAddingNote ? "Adding..." : "Add Note"}
                </RippleButton>
              </div>

              {/* Escalate Section */}
              <div className="escalate_section">
                <textarea
                  placeholder="Reason for escalation..."
                  className="note_textarea"
                  value={escalateText}
                  onChange={(e) => setEscalateText(e.target.value)}
                />
                <RippleButton
                  className="escalate_btn"
                  onClick={async () => {
                    if (!escalateText.trim()) return;

                    setIsEscalating(true);
                    setNoteMessage(null);

                    try {
                      const newEscalation = {
                        id: Date.now(),
                        type: "escalation",
                        content: escalateText.trim(),
                        author: "Admin",
                        timestamp: new Date().toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      };

                      setExistingNotes((prev) => [newEscalation, ...prev]);

                      if (onAddNote) {
                        await onAddNote(
                          orderData.id,
                          "escalation",
                          escalateText.trim()
                        );
                      }

                      setNoteMessage({
                        type: "success",
                        text: "Order escalated successfully!",
                      });

                      setEscalateText("");
                      setTimeout(() => setNoteMessage(null), 3000);
                    } catch (error) {
                      setNoteMessage({
                        type: "error",
                        text: "Failed to escalate order. Please try again.",
                      });
                      setTimeout(() => setNoteMessage(null), 3000);
                    } finally {
                      setIsEscalating(false);
                    }
                  }}
                  disabled={!escalateText.trim() || isEscalating}
                >
                  <AlertCircle size={16} />
                  {isEscalating ? "Escalating..." : "Escalate"}
                </RippleButton>
              </div>

              {/* Note Message */}
              {noteMessage && (
                <div className={`note_message ${noteMessage.type}`}>
                  {noteMessage.type === "success" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <span>{noteMessage.text}</span>
                </div>
              )}

              {/* Existing Notes */}
              <div className="existing_notes">
                <h5>Previous Notes & Escalations</h5>
                {existingNotes.map((note) => (
                  <div key={note.id} className={`note_item ${note.type}`}>
                    <div className="note_content">
                      <h6>
                        {note.type === "escalation" ? "Escalation" : "Note"}
                      </h6>
                      <p>{note.content}</p>
                      <span className="note_meta">
                        by {note.author} • {note.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetailsDrawer;
