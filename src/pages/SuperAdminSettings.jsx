import React, { useState } from "react";

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
  ];

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

              <div className="submit_button">
                <button type="submit">Save Settings</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminSettings;
