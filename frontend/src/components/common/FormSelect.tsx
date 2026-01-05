import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, SearchIcon } from "./icons";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  onLoadMore?: () => void;
  loading?: boolean;
}

const FormSelectCustom: React.FC<FormSelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = "Chọn...",
  disabled,
  className = "",
  containerClassName = "",
  searchable,
  onSearchChange,
  searchValue,
  onLoadMore,
  loading = false,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value);

  // click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Autofocus input when opened
  useEffect(() => {
    if (open && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, searchable]);

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    if (!onLoadMore || loading) return;
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      onLoadMore();
    }
  };

  return (
    <div className={`form-group ${containerClassName}`} ref={wrapperRef}>
      {label && <label className="form-label">{label}</label>}

      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          className={`
            select-trigger
            ${error ? "select-trigger-error" : ""}
            ${className}
          `}
        >
          <span
            className={`truncate ${
              selected ? "text-slate-700 font-medium" : "text-slate-400"
            }`}
          >
            {selected?.label || placeholder}
          </span>
          <ChevronDownIcon
            className={`w-5 h-5 transition-transform ml-2 shrink-0 ${
              open ? "rotate-180" : ""
            } ${disabled ? "text-slate-300" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="select-dropdown">
            {searchable && (
              <div className="select-search-container">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="Tìm kiếm..."
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            <ul
              ref={listRef}
              onScroll={handleScroll}
              className="select-options"
            >
              {!searchable && options.length === 0 && (
                <li className="select-empty">Không có tùy chọn</li>
              )}
              {searchable && options.length === 0 && !loading && (
                <li className="select-empty">Không tìm thấy kết quả</li>
              )}
              {options.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => {
                    onChange?.(opt.value);
                    setOpen(false);
                  }}
                  className={`
                    select-option
                    ${value === opt.value ? "is-selected" : ""}
                  `}
                >
                  {opt.label}
                </li>
              ))}
              {loading && (
                <li className="px-4 py-2 text-center text-slate-400 text-xs flex justify-center">
                  <span className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default FormSelectCustom;
