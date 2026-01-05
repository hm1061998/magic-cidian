import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, className = "", containerClassName = "", ...props },
    ref
  ) => {
    return (
      <div className={`form-group ${containerClassName}`}>
        {label && <label className="form-label">{label}</label>}
        <input
          ref={ref}
          className={`input ${error ? "input-error" : ""} ${className}`}
          {...props}
        />
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
