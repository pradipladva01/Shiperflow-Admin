import React, { useState } from "react";
import RippleButton from "../RippleButton";
import { Plus, RefreshCcw, Trash2 } from "lucide-react";
import Select from "react-select";

const syncFrequencyoptions = [
  { value: "cheapest", label: "Real time" },
  { value: "every_15", label: "Every 15 minutes" },
  { value: "manual", label: "Manual Only" },
];

const ShopifyForm = () => {
  const [stores, setStores] = useState([
    {
      id: 1,
      name: "Fashion Boutique",
      domain: "fashion-boutique.myshopify.com",
      connected: true,
      autoSync: false,
      syncFrequency: null,
      lastSynced: "15 Jul 2023, 04:00 pm",
    },
  ]);

  const handleToggleSync = (id) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === id
          ? {
              ...store,
              autoSync: !store.autoSync,
              syncFrequency: !store.autoSync ? null : store.syncFrequency,
            }
          : store
      )
    );
  };
  const handleFrequencyChange = (id, option) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === id ? { ...store, syncFrequency: option } : store
      )
    );
  };

  const handleDisconnect = (id) => {
    setStores((prev) => prev.filter((store) => store.id !== id));
  };

  const handleSyncNow = (id) => {
    const now = new Date();
    const formatted = now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setStores((prev) =>
      prev.map((store) =>
        store.id === id ? { ...store, lastSynced: formatted } : store
      )
    );
  };
  return (
    <>
      <div className="form_main">
        <h5 className="h5_main">
          Shopify Store Integrations
          <RippleButton className="connect_button">
            <Plus size={16} />
            Connect New Store
          </RippleButton>
        </h5>

        <div className="shopify_card_main">
          {stores.length === 0 ? (
            <div className="no_store_message">⚠️ Store not available</div>
          ) : (
            stores.map((store) => (
              <div className="shopify_card" key={store.id}>
                <div className="card_top">
                  <div className="card_info">
                    <h6>
                      {store.name}
                      <span className="default_tag">Connected</span>
                    </h6>
                    <p>{store.domain}</p>
                  </div>
                  <RippleButton
                    className="disconnect_button"
                    onClick={() => handleDisconnect(store.id)}
                  >
                    <Trash2 />
                    Disconnect
                  </RippleButton>
                </div>

                <div className="card_bottom">
                  <div className="input_form_main">
                    <div className="toggle_row">
                      <div className="toggle_main">
                        <h6>
                          Auto Sync
                          <br />
                          <span>Automatically sync orders and inventory</span>
                        </h6>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={store.autoSync}
                            onChange={() => handleToggleSync(store.id)}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="input_main">
                      <label className="form-label">Sync Frequency</label>
                      <Select
                        options={syncFrequencyoptions}
                        value={store.syncFrequency}
                        onChange={(opt) => handleFrequencyChange(store.id, opt)}
                        className="option_select"
                        placeholder="Select frequency"
                        isDisabled={!store.autoSync}
                        isClearable
                      />
                    </div>
                  </div>
                </div>

                <div className="sync_order">
                  <p>Last synced: {store.lastSynced}</p>
                  <RippleButton
                    className="refresh_button"
                    onClick={() => handleSyncNow(store.id)}
                  >
                    <RefreshCcw size={16} />
                    Sync now
                  </RippleButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ShopifyForm;
