import React from "react";
import {
  Package,
  DollarSign,
  Calendar,
  Truck,
  MapPin,
  X,
  CheckCircle,
} from "lucide-react";
import RippleButton from "./RippleButton";

const OrderDetailsModal = ({ isOpen, onClose, orderData }) => {
  if (!isOpen) return null;

  const trackingTimeline = [
    {
      status: "Order Placed",
      date: "Jan 15, 2024 10:30 AM",
      completed: true,
    },
    {
      status: "Order Confirmed",
      date: "Jan 15, 2024 11:00 AM",
      completed: true,
    },
    {
      status: "Shipped",
      date: "Jan 16, 2024 09:15 AM",
      completed: true,
    },
    {
      status: "Out for Delivery",
      date: "Jan 17, 2024 08:30 AM",
      completed: true,
    },
    {
      status: "Delivered",
      date: "Jan 17, 2024 02:45 PM",
      completed: true,
    },
  ];

  return (
    <div className="modal_overlay" onClick={onClose}>
      <div className="order_details_modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal_header">
          <div className="header_left">
            <Package size={20} color="#374151" />
            <h3>Order Details - {orderData?.orderId || "ORD12345"}</h3>
          </div>
          <div className="header_right">
            <div className="status_tag delivered">Delivered</div>
            <button className="close_btn" onClick={onClose}>
              <X size={20} color="#6b7280" />
            </button>
          </div>
        </div>

        <div className="order_date">
          Order placed on {orderData?.orderDate || "2024-01-15"}
        </div>

        {/* Content */}
        <div className="modal_content">
          {/* Left Column - Order Information */}
          <div className="order_info_section">
            <h4>Order Information</h4>
            <div className="info_item">
              <Package size={16} color="#6b7280" />
              <span>Product: {orderData?.product || "Wireless Earbuds"}</span>
            </div>
            <div className="info_item">
              <DollarSign size={16} color="#6b7280" />
              <span>Amount: {orderData?.amount || "₹2,500"}</span>
            </div>
            <div className="info_item">
              <Calendar size={16} color="#6b7280" />
              <span>Payment: </span>
              <span className="payment_tag cod">COD</span>
            </div>
            <div className="info_item">
              <Truck size={16} color="#6b7280" />
              <span>Courier: {orderData?.courier || "BlueDart"}</span>
            </div>
          </div>

          {/* Right Column - Shipping Information */}
          <div className="shipping_info_section">
            <h4>Shipping Information</h4>
            <div className="info_item">
              <MapPin size={16} color="#6b7280" />
              <div className="address_info">
                <span>Delivery Address:</span>
                <div className="address_text">
                  {orderData?.address ||
                    "123 Main Street, Apartment 4B\nMumbai, Maharashtra 400001\nIndia"}
                </div>
              </div>
            </div>
            <div className="info_item">
              <Package size={16} color="#6b7280" />
              <span>Weight: {orderData?.weight || "0.5 kg"}</span>
            </div>
            <div className="info_item">
              <Calendar size={16} color="#6b7280" />
              <span>
                Expected Delivery:{" "}
                {orderData?.expectedDelivery || "Jan 18, 2024"}
              </span>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="tracking_timeline">
          <h4>Tracking Timeline</h4>
          <div className="timeline_container">
            {trackingTimeline.map((item, index) => (
              <div key={index} className="timeline_item">
                <div className="timeline_dot">
                  <CheckCircle size={12} color="#10b981" />
                </div>
                <div className="timeline_content">
                  <div className="timeline_status">{item.status}</div>
                  <div className="timeline_date">{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="modal_footer">
          <RippleButton className="close_btn_secondary" onClick={onClose}>
            Close
          </RippleButton>
          <RippleButton className="download_invoice_btn">
            Download Invoice
          </RippleButton>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
