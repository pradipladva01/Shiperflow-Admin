import React, { useState } from "react";
import {
  X,
  Scale,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Package,
  Flag,
  CheckSquare,
} from "lucide-react";
import RippleButton from "./RippleButton";

const ShippingChargesDetailsDrawer = ({
  isOpen,
  onClose,
  orderData,
  onAddNote,
  onEscalate,
  onResolve,
  onRaiseDispute,
}) => {
  const [noteText, setNoteText] = useState("");
  const [escalateText, setEscalateText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isEscalating, setIsEscalating] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isRaisingDispute, setIsRaisingDispute] = useState(false);
  const [message, setMessage] = useState(null);

  // Mock existing notes and comments
  const [existingNotes, setExistingNotes] = useState([
    {
      id: 1,
      type: "note",
      content: "Courier overweight detected",
      author: "Admin",
      timestamp: "2024-10-02",
    },
    {
      id: 2,
      type: "note",
      content: "Photos requested from merchant",
      author: "Admin",
      timestamp: "2024-10-02",
    },
    {
      id: 3,
      type: "escalation",
      content: "Weight discrepancy exceeds 100% threshold",
      author: "System",
      timestamp: "2024-10-01",
    },
  ]);

  if (!isOpen || !orderData) return null;

  const getDisputeStatusBadge = (status) => {
    const statusConfig = {
      open: { className: "open", label: "Open", color: "#ef4444" },
      escalated: {
        className: "escalated",
        label: "Escalated",
        color: "#f59e0b",
      },
      resolved: { className: "resolved", label: "Resolved", color: "#10b981" },
      none: { className: "none", label: "None", color: "#6b7280" },
    };

    const config = statusConfig[status] || statusConfig.none;
    return (
      <span
        className={`status_badge ${config.className}`}
        style={{ backgroundColor: `${config.color}20`, color: config.color }}
      >
        {config.label}
      </span>
    );
  };

  const getDifferenceStyle = (value, type = "amount") => {
    if (type === "amount") {
      if (value > 50) return { color: "#ef4444", fontWeight: "600" };
      if (value > 0) return { color: "#f59e0b", fontWeight: "600" };
      return { color: "#10b981", fontWeight: "600" };
    } else {
      if (value > 100) return { color: "#ef4444", fontWeight: "600" };
      if (value > 20) return { color: "#f59e0b", fontWeight: "600" };
      return { color: "#10b981", fontWeight: "600" };
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    setIsAddingNote(true);
    setMessage(null);

    try {
      const newNote = {
        id: Date.now(),
        type: "note",
        content: noteText.trim(),
        author: "Admin",
        timestamp: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      setExistingNotes((prev) => [newNote, ...prev]);

      if (onAddNote) {
        await onAddNote(orderData.id, "note", noteText.trim());
      }

      setMessage({
        type: "success",
        text: "Note added successfully!",
      });

      setNoteText("");
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to add note. Please try again.",
      });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleEscalate = async () => {
    if (!escalateText.trim()) return;

    setIsEscalating(true);
    setMessage(null);

    try {
      if (onEscalate) {
        await onEscalate(orderData.id, escalateText.trim());
      }

      setMessage({
        type: "success",
        text: "Order escalated successfully!",
      });

      setEscalateText("");
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to escalate order. Please try again.",
      });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsEscalating(false);
    }
  };

  const handleResolve = async () => {
    setIsResolving(true);
    setMessage(null);

    try {
      if (onResolve) {
        await onResolve(orderData.id);
      }

      setMessage({
        type: "success",
        text: "Dispute resolved successfully!",
      });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to resolve dispute. Please try again.",
      });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsResolving(false);
    }
  };

  const handleRaiseDispute = async () => {
    setIsRaisingDispute(true);
    setMessage(null);

    try {
      if (onRaiseDispute) {
        await onRaiseDispute(orderData.id);
      }

      setMessage({
        type: "success",
        text: "Dispute raised successfully!",
      });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to raise dispute. Please try again.",
      });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsRaisingDispute(false);
    }
  };

  return (
    <>
      {isOpen && <div className="drawer_backdrop show" onClick={onClose} />}
      <div className={`shipping_charges_drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer_header">
          <div className="order_info">
            <div className="order_id_section">
              <h3>Order Details - {orderData.id}</h3>
              <div className="order_meta">
                <span className="merchant">Merchant: {orderData.merchant}</span>
                <span className="courier">
                  Courier Partner: {orderData.courier}
                </span>
                <span className="updated">
                  Last Updated: {orderData.lastUpdated}
                </span>
              </div>
            </div>
            <div className="order_status">
              {getDisputeStatusBadge(orderData.disputeStatus)}
              <RippleButton className="close_btn" onClick={onClose}>
                <X size={20} />
              </RippleButton>
            </div>
          </div>
        </div>

        <div className="drawer_content">
          {/* Order Summary Section */}
          <div className="content_section">
            <div className="summary_cards">
              <div className="summary_card">
                <div className="card_header">
                  <h4>Order Summary</h4>
                  <span className="status_tag delivered">Delivered</span>
                </div>
                <div className="card_content">
                  <div className="info_item">
                    <span className="label">Merchant:</span>
                    <span className="value">{orderData.merchant}</span>
                  </div>
                  <div className="info_item">
                    <span className="label">Courier Partner:</span>
                    <span className="value">{orderData.courier}</span>
                  </div>
                  <div className="info_item">
                    <span className="label">Last Updated:</span>
                    <span className="value">{orderData.lastUpdated}</span>
                  </div>
                  <div className="info_item">
                    <span className="label">Discrepancy Type:</span>
                    <span className="value">Weight mismatch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weight Analysis Section */}
          <div className="content_section">
            <div className="weight_analysis">
              <div className="section_header">
                <Scale size={20} />
                <h4>Weight Analysis</h4>
              </div>
              <div className="weight_comparison">
                <div className="weight_item">
                  <span className="weight_label">Declared Weight</span>
                  <span className="weight_value">
                    {orderData.declaredWeight}
                  </span>
                </div>
                <div className="weight_item">
                  <span className="weight_label">Charged Weight</span>
                  <span className="weight_value charged">
                    {orderData.chargedWeight}
                    <AlertTriangle size={12} className="warning_icon" />
                  </span>
                </div>
                <div className="weight_difference">
                  <span className="difference_label">Difference:</span>
                  <span
                    className="difference_value"
                    style={getDifferenceStyle(
                      orderData.percentageDiff,
                      "percentage"
                    )}
                  >
                    +{orderData.percentageDiff}%
                  </span>
                </div>
                <div className="weight_progress">
                  <div className="progress_bar">
                    <div
                      className="progress_fill"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <span className="progress_label">Weight Comparison</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charges Breakdown Section */}
          <div className="content_section">
            <div className="charges_breakdown">
              <div className="section_header">
                <DollarSign size={20} />
                <h4>Charges Breakdown</h4>
              </div>
              <div className="charges_comparison">
                <div className="charge_item">
                  <span className="charge_label">Declared Charges</span>
                  <span className="charge_value declared">
                    ₹{orderData.declaredCharges.replace("₹", "")}
                  </span>
                </div>
                <div className="charge_item">
                  <span className="charge_label">FShip Charges</span>
                  <span className="charge_value fship">
                    ₹{orderData.fshipCharges.replace("₹", "")}
                  </span>
                </div>
                <div className="charge_breakdown">
                  <h5>FShip Charges Breakdown:</h5>
                  <div className="breakdown_item">
                    <span>Forward Charges:</span>
                    <span>₹80</span>
                  </div>
                  <div className="breakdown_item">
                    <span>RTO Charges:</span>
                    <span>₹0</span>
                  </div>
                  <div className="breakdown_item">
                    <span>Fuel Surcharge:</span>
                    <span>₹20</span>
                  </div>
                  <div className="breakdown_item">
                    <span>GST:</span>
                    <span>₹8</span>
                  </div>
                </div>
                <div className="total_difference">
                  <span className="difference_label">Total Difference:</span>
                  <span
                    className="difference_value"
                    style={getDifferenceStyle(orderData.difference)}
                  >
                    +₹{orderData.difference}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline Section */}
          <div className="content_section">
            <div className="order_timeline">
              <div className="section_header">
                <Clock size={20} />
                <h4>Order Timeline</h4>
              </div>
              <div className="timeline">
                <div className="timeline_item completed">
                  <div className="timeline_dot"></div>
                  <div className="timeline_content">
                    <h5>Order Created</h5>
                    <p>Order has been created successfully</p>
                    <span className="timeline_date">2024-10-01 10:30</span>
                  </div>
                </div>
                <div className="timeline_item completed">
                  <div className="timeline_dot"></div>
                  <div className="timeline_content">
                    <h5>Picked Up</h5>
                    <p>Package picked up from merchant</p>
                    <span className="timeline_date">2024-10-01 14:30</span>
                  </div>
                </div>
                <div className="timeline_item completed">
                  <div className="timeline_dot"></div>
                  <div className="timeline_content">
                    <h5>In Transit</h5>
                    <p>Package is on the way to destination</p>
                    <span className="timeline_date">2024-10-01 18:30</span>
                  </div>
                </div>
                <div className="timeline_item completed">
                  <div className="timeline_dot"></div>
                  <div className="timeline_content">
                    <h5>Delivered</h5>
                    <p>Package delivered successfully</p>
                    <span className="timeline_date">2024-10-02 12:30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dispute Status Section */}
          <div className="content_section">
            <div className="dispute_status_section">
              <div className="section_header">
                <Flag size={20} />
                <h4>Dispute Status</h4>
              </div>
              <div className="dispute_actions">
                <div className="status_display">
                  {getDisputeStatusBadge(orderData.disputeStatus)}
                  <span className="last_updated">
                    Last updated: {orderData.lastUpdated}
                  </span>
                </div>
                <div className="action_buttons">
                  <RippleButton
                    className={`action_btn ${
                      orderData.disputeStatus === "open" ? "disabled" : ""
                    }`}
                    onClick={handleRaiseDispute}
                    disabled={
                      orderData.disputeStatus === "open" || isRaisingDispute
                    }
                  >
                    <Flag size={16} />
                    {isRaisingDispute ? "Raising..." : "Raise Dispute"}
                  </RippleButton>
                  <RippleButton
                    className={`action_btn ${
                      orderData.disputeStatus === "escalated" ? "active" : ""
                    }`}
                    onClick={handleEscalate}
                    disabled={isEscalating}
                  >
                    <TrendingUp size={16} />
                    {isEscalating ? "Escalating..." : "Escalate"}
                  </RippleButton>
                  <RippleButton
                    className={`action_btn ${
                      orderData.disputeStatus === "resolved" ? "disabled" : ""
                    }`}
                    onClick={handleResolve}
                    disabled={
                      orderData.disputeStatus === "resolved" || isResolving
                    }
                  >
                    <CheckSquare size={16} />
                    {isResolving ? "Resolving..." : "Resolve"}
                  </RippleButton>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Comments Section */}
          <div className="content_section">
            <div className="notes_section">
              <div className="section_header">
                <MessageSquare size={20} />
                <h4>Notes & Comments</h4>
              </div>

              {/* Add Note Section */}
              <div className="add_note_section">
                <textarea
                  placeholder="Add a new note or comment..."
                  className="note_textarea"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={3}
                />
                <RippleButton
                  className="add_note_btn"
                  onClick={handleAddNote}
                  disabled={!noteText.trim() || isAddingNote}
                >
                  <MessageSquare size={16} />
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
                  rows={3}
                />
                <RippleButton
                  className="escalate_btn"
                  onClick={handleEscalate}
                  disabled={!escalateText.trim() || isEscalating}
                >
                  <TrendingUp size={16} />
                  {isEscalating ? "Escalating..." : "Escalate"}
                </RippleButton>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`message ${message.type}`}>
                  {message.type === "success" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Existing Notes */}
              <div className="existing_notes">
                <h5>Previous Notes & Comments</h5>
                {existingNotes.map((note) => (
                  <div key={note.id} className={`note_item ${note.type}`}>
                    <div className="note_content">
                      <div className="note_header">
                        <h6>
                          {note.type === "escalation" ? "Escalation" : "Note"}
                        </h6>
                        <span className="note_author">by {note.author}</span>
                      </div>
                      <p>{note.content}</p>
                      <span className="note_timestamp">{note.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingChargesDetailsDrawer;
