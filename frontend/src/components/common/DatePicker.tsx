import React from "react";
import { CalendarIcon } from "./icons";

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, className = "", placeholder, ...props }, ref) => {
    return (
      <div className="date-picker-container">
        {label && <label className="date-picker-label">{label}</label>}
        <div className="date-picker-wrapper group">
          <input
            type="date"
            ref={ref}
            placeholder={placeholder}
            className={`
              date-picker-input
              ${error ? "date-picker-input-error" : ""}
              ${className}
            `}
            {...props}
          />
          <CalendarIcon className="date-picker-icon" />

          {/* Placeholder text when no date is selected */}
          {!props.value && placeholder && (
            <span className="date-picker-placeholder">{placeholder}</span>
          )}
        </div>
        {error && (
          <p className="date-picker-error-msg">
            <span className="date-picker-dot"></span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
