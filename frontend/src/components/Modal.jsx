import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

const sizeClasses = {
  sm: "modal-sm",
  md: "modal-md",
  lg: "modal-lg",
  xl: "modal-xl",
};

const Modal = ({ open, title, description, children, footer, onClose, size = "md" }) => {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-shell">
      <button
        type="button"
        className="modal-backdrop"
        onClick={onClose}
        aria-label="Mbyll dritaren"
      />

      <div
        className={`modal-card ${sizeClasses[size] || sizeClasses.md}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{title}</h2>
            {description && (
              <p className="modal-description">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close"
            aria-label="Mbyll"
          >
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
