import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label className="form-label">{label}</label>}
        <textarea
          ref={ref}
          className={`textarea ${error ? "textarea-error" : ""} ${className}`}
          {...props}
        />
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
