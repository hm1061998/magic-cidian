import React, { useEffect, useState } from "react";
import { CloseIcon } from "./icons";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = "",
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  // Sync shouldRender with isOpen to allow exit animations
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className={`drawer-overlay ${!isOpen ? "is-closed" : ""}`}>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${
          isOpen ? "animate-fade-in" : "animate-fade-out"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`drawer-panel ${
          isOpen ? "animate-slide-in-right" : "animate-slide-out-right"
        } ${className}`}
      >
        <div className="drawer-header">
          <h3 className="drawer-title">{title}</h3>
          <button onClick={onClose} className="drawer-close-btn">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="drawer-content">{children}</div>

        {footer && <div className="drawer-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Drawer;
