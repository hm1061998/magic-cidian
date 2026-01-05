import React, { useEffect, useRef } from "react";

interface SelectAllCheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
  label?: string;
  subLabel?: string;
  className?: string;
}

const SelectAllCheckbox: React.FC<SelectAllCheckboxProps> = ({
  checked,
  indeterminate,
  onChange,
  label = "Chọn tất cả",
  subLabel,
  className = "",
}) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={`checkbox-card ${className}`}>
      <input
        type="checkbox"
        ref={checkboxRef}
        checked={checked}
        onChange={onChange}
        className="checkbox-input"
      />
      <label className="checkbox-label" onClick={onChange}>
        {label}{" "}
        {subLabel && (
          <span className="text-slate-400 font-normal">{subLabel}</span>
        )}
      </label>
    </div>
  );
};

export default SelectAllCheckbox;
