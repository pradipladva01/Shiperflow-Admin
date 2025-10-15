import React, { useState, useRef, useEffect } from "react";
import MenuIcon from "../resources/icons/Menu_Icon.svg";
import Notification from "../resources/icons/Notification.svg";
import Avatar from "../resources/images/avatar-1.jpg";
import RippleButton from "../components/RippleButton";
import { useLogout } from "../utils/hooks/auth/useLogout";
import { useAuthContext } from "../utils/hooks/auth/useAuthContext";

const AdminHeader = ({ toggleSidebar, collapsed }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const dropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const userData = (() => {
    if (typeof user === "string") {
      try {
        return JSON.parse(user);
      } catch (error) {
        return { name: user, email: user };
      }
    }
    return user || {};
  })();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsNotificationDropdownOpen(false);
  };

  const handleNotificationClick = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  return (
    <>
      <div className={`header_main ${collapsed ? "collapsed" : ""}`}>
        <div className="header_wrapper">
          <div className="header_left">
            <RippleButton onClick={toggleSidebar}>
              <img src={MenuIcon} alt="MenuIcon" />
            </RippleButton>
          </div>
          <div className="header_right">
            <ul>
              <li className="dropdown items wallet-field">
                <RippleButton>
                  <span className="wallet-icon">Wallet:</span>
                  <span className="wallet-amount">₹10,000,000.00</span>
                </RippleButton>
              </li>
              <li
                className="dropdown items notification-dropdown"
                ref={notificationDropdownRef}
              >
                <RippleButton onClick={handleNotificationClick}>
                  <img src={Notification} alt="Notify" />
                  <span className="notification-badge">3</span>
                </RippleButton>
                {isNotificationDropdownOpen && (
                  <div className="notification-dropdown-menu">
                    <div className="notification-header">
                      <h3>Notifications</h3>
                      <button className="mark-all-read">
                        Mark all as read
                      </button>
                    </div>

                    <div className="notification-list">
                      <div className="notification-item unread">
                        <div className="notification-icon">
                          <div className="icon-circle order-icon">📦</div>
                        </div>
                        <div className="notification-content">
                          <div className="notification-title">
                            New Order Received
                          </div>
                          <div className="notification-message">
                            Order #12345 has been placed by John Doe
                          </div>
                          <div className="notification-time">2 minutes ago</div>
                        </div>
                        <div className="notification-status">
                          <div className="unread-dot"></div>
                        </div>
                      </div>

                      <div className="notification-item unread">
                        <div className="notification-icon">
                          <div className="icon-circle shipment-icon">🚚</div>
                        </div>
                        <div className="notification-content">
                          <div className="notification-title">
                            Shipment Status Update
                          </div>
                          <div className="notification-message">
                            Your shipment #SH123 has been dispatched
                          </div>
                          <div className="notification-time">
                            15 minutes ago
                          </div>
                        </div>
                        <div className="notification-status">
                          <div className="unread-dot"></div>
                        </div>
                      </div>

                      <div className="notification-item">
                        <div className="notification-icon">
                          <div className="icon-circle payment-icon">💰</div>
                        </div>
                        <div className="notification-content">
                          <div className="notification-title">
                            Payment Received
                          </div>
                          <div className="notification-message">
                            Payment of ₹2,500 received for Order #12340
                          </div>
                          <div className="notification-time">1 hour ago</div>
                        </div>
                        <div className="notification-status">
                          <div className="read-indicator"></div>
                        </div>
                      </div>

                      <div className="notification-item">
                        <div className="notification-icon">
                          <div className="icon-circle system-icon">⚙️</div>
                        </div>
                        <div className="notification-content">
                          <div className="notification-title">
                            System Maintenance
                          </div>
                          <div className="notification-message">
                            Scheduled maintenance completed successfully
                          </div>
                          <div className="notification-time">2 hours ago</div>
                        </div>
                        <div className="notification-status">
                          <div className="read-indicator"></div>
                        </div>
                      </div>
                    </div>

                    <div className="notification-footer">
                      <button className="view-all-notifications">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </li>
              <li className="dropdown items profile-dropdown" ref={dropdownRef}>
                <RippleButton onClick={handleProfileClick}>
                  <img src={Avatar} alt="Avatar" className="avatar" />
                </RippleButton>
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown-menu">
                    <div className="profile-section">
                      <div className="profile-content">
                        <div className="profile-avatar">
                          <img
                            src={Avatar}
                            alt="Profile Avatar"
                            className="avatar-image"
                          />
                        </div>
                        <div className="profile-details">
                          <div className="profile-name">
                            <span className="name-text">
                              {userData?.name || "User"}
                            </span>
                            <span className="vulcan-salute">🖖</span>
                          </div>
                          <div className="profile-email">
                            {userData?.email || "user@example.com"}
                          </div>
                        </div>
                      </div>
                      <div className="profile-divider"></div>
                    </div>

                    <div className="dropdown-actions">
                      <div
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <span>My Account</span>
                      </div>
                      <div className="dropdown-item" onClick={handleLogout}>
                        <span>Logout</span>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
