import React, { useState } from "react";
import { CalendarIcon, CloseIcon } from "./icons";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear?: () => void;
  className?: string;
  height?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  className = "",
  height = "h-10",
}) => {
  const hasValue = startDate || endDate;

  const handleClear = () => {
    onStartDateChange("");
    onEndDateChange("");
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`date-range-container ${height}`}>
        <CalendarIcon className="date-range-icon" />

        <div className="date-range-inputs">
          {/* Start Date */}
          <div className="date-range-input-wrapper">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              max={endDate || undefined}
              className={`
                date-range-input
                ${!startDate ? "is-empty" : ""}
              `}
            />
            {!startDate && (
              <span className="date-range-placeholder">Từ ngày</span>
            )}
          </div>

          {/* Separator */}
          <span className="date-range-separator">→</span>

          {/* End Date */}
          <div className="date-range-input-wrapper">
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              min={startDate || undefined}
              className={`
                date-range-input
                ${!endDate ? "is-empty" : ""}
              `}
            />
            {!endDate && (
              <span className="date-range-placeholder">Đến ngày</span>
            )}
          </div>
        </div>

        {/* Clear Button */}
        {hasValue && (
          <button
            onClick={handleClear}
            className="date-range-clear"
            type="button"
            title="Xóa bộ lọc ngày"
          >
            <CloseIcon className="w-4 h-4 text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
