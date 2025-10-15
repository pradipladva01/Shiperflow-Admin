import React from "react";
import RippleButton from "./RippleButton";

const CommonModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium", // small, medium, large, xlarge
  type = "default", // default, confirmation, form, details
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
  headerActions,
  footerActions,
  confirmationData = null, // { message, icon, onConfirm, onCancel, confirmText, cancelText }
  ...props
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const getModalSize = () => {
    switch (size) {
      case "small":
        return "400px";
      case "medium":
        return "500px";
      case "large":
        return "700px";
      case "xlarge":
        return "800px";
      default:
        return "500px";
    }
  };

  const getModalClass = () => {
    const baseClass = "common-modal";
    const sizeClass = `modal-${size}`;
    const typeClass = `modal-${type}`;
    return `${baseClass} ${sizeClass} ${typeClass} ${className}`.trim();
  };

  // Confirmation Modal
  if (type === "confirmation" && confirmationData) {
    return (
      <div className="modal_overlay" onClick={handleOverlayClick}>
        <div
          className={getModalClass()}
          style={{ width: getModalSize() }}
          {...props}
        >
          {confirmationData.icon && (
            <div className="icons">{confirmationData.icon}</div>
          )}
          <h4>{confirmationData.message}</h4>
          <div className="modal_actions">
            <RippleButton
              className="confirm_button"
              onClick={confirmationData.onConfirm}
            >
              {confirmationData.confirmText || "Yes"}
            </RippleButton>
            <RippleButton
              className="cancel_button"
              onClick={confirmationData.onCancel || onClose}
            >
              {confirmationData.cancelText || "No"}
            </RippleButton>
          </div>
        </div>
      </div>
    );
  }

  // Default Modal
  return (
    <div className="modal_overlay" onClick={handleOverlayClick}>
      <div
        className={getModalClass()}
        style={{ width: getModalSize() }}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton || headerActions) && (
          <div className="modal-header">
            {title && <h2>{title}</h2>}
            <div className="header-actions">
              {headerActions}
              {showCloseButton && (
                <button className="close-btn" onClick={onClose}>
                  &times;
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="modal-content">{children}</div>

        {/* Footer */}
        {footerActions && <div className="modal-footer">{footerActions}</div>}
      </div>
    </div>
  );
};

// Form Modal Wrapper Component
export const FormModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  children,
  size = "medium",
  submitText = "Save",
  cancelText = "Cancel",
  showSubmitButton = true,
  showCancelButton = true,
  submitButtonProps = {},
  cancelButtonProps = {},
  className = "",
  ...props
}) => {
  const footerActions = (
    <div className="form-actions">
      {showCancelButton && (
        <RippleButton
          type="button"
          className="cancel-btn"
          onClick={onClose}
          {...cancelButtonProps}
        >
          {cancelText}
        </RippleButton>
      )}
      {showSubmitButton && (
        <RippleButton type="submit" className="save-btn" {...submitButtonProps}>
          {submitText}
        </RippleButton>
      )}
    </div>
  );

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      type="form"
      className={`form-modal ${className}`}
      footerActions={footerActions}
      {...props}
    >
      <form className="modal_form" onSubmit={onSubmit}>
        {children}
      </form>
    </CommonModal>
  );
};

// Confirmation Modal Wrapper Component
export const ConfirmationModal = ({
  isOpen,
  onClose,
  message,
  icon,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "No",
  confirmButtonClass = "confirm_button",
  cancelButtonClass = "cancel_button",
  size = "small",
  ...props
}) => {
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      type="confirmation"
      size={size}
      confirmationData={{
        message,
        icon,
        onConfirm,
        onCancel: onCancel || onClose,
        confirmText,
        cancelText,
        confirmButtonClass,
        cancelButtonClass,
      }}
      {...props}
    />
  );
};

// Details Modal Wrapper Component
export const DetailsModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "large",
  showCloseButton = true,
  className = "",
  ...props
}) => {
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      type="details"
      showCloseButton={showCloseButton}
      className={`details-modal ${className}`}
      {...props}
    >
      {children}
    </CommonModal>
  );
};

export default CommonModal;
