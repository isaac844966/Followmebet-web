"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { ChevronDown, X, Check } from "lucide-react";
import { createPortal } from "react-dom";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  error,
  disabled = false,
  searchable = false,
}) => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [isMounted, setIsMounted] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle mounting for client-side rendering
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Filter options based on search term
  useEffect(() => {
    if (searchable && searchTerm) {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options, searchable]);

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(true);
      setSearchTerm("");
      // Reset filtered options when opening
      setFilteredOptions(options);

      // Focus the search input if searchable
      setTimeout(() => {
        if (searchable && inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSelect = (option: Option) => {
    onChange(option.value);
    handleClose();
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  // Modal component that slides up from the bottom
  const SelectModal = () => {
    if (!isMounted) return null;

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 animate-in fade-in">
        <div
          className={`
            w-full max-w-md rounded-t-xl shadow-lg 
            ${isDarkMode ? "bg-primary-1300" : "bg-white"}
            transform transition-transform duration-300 ease-out
            animate-in slide-in-from-bottom
            max-h-[80vh] flex flex-col
          `}
        >
          {/* Header */}
          <div
            className={`
            flex items-center justify-between p-4 border-b
            ${isDarkMode ? "border-gray-700" : "border-gray-200"}
          `}
          >
            <h3
              className={`font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {label}
            </h3>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X size={20} color={isDarkMode ? "#FFFFFF" : "#1E1F68"} />
            </button>
          </div>

         

          {/* Options list */}
          <div className="overflow-y-auto flex-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => (
                <div
                  key={item.value}
                  onClick={() => handleSelect(item)}
                  className={`
                    p-4 cursor-pointer border-b flex items-center justify-between
                    ${isDarkMode ? "border-gray-700" : "border-gray-100"}
                    ${
                      item.value === value
                        ? isDarkMode
                          ? "bg-primary-400/20"
                          : "bg-primary-400/10"
                        : ""
                    }
                    hover:bg-gray-100 dark:hover:bg-gray-700
                  `}
                >
                  <span
                    className={`
                      ${
                        item.value === value
                          ? "font-medium text-primary-400"
                          : isDarkMode
                          ? "text-white"
                          : "text-primary-100"
                      }
                    `}
                  >
                    {item.label}
                  </span>

                  {item.value === value && (
                    <Check size={20} className="text-primary-400" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <span
                  className={`
                    ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                  `}
                >
                  No results found
                </span>
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="mb-4">
      <label
        className={`${
          isDarkMode ? "text-white" : "text-primary-100"
        } mb-2 font-medium block`}
      >
        {label}
      </label>

      <div
        onClick={handleOpen}
        className={`
          flex items-center justify-between
          ${isDarkMode ? "bg-primary-1400" : "bg-primary-1200"}
          rounded-lg px-4 h-20 cursor-pointer
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span
          className={`
            flex-1 
            ${
              selectedOption
                ? isDarkMode
                  ? "text-white"
                  : "text-primary-100"
                : "text-gray-500"
            }
          `}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="flex items-center">
          {selectedOption && !disabled && (
            <button
              onClick={clearSelection}
              className="mr-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
              <X size={16} color={isDarkMode ? "#FFFFFF" : "#1E1F68"} />
            </button>
          )}
          <ChevronDown size={20} color={isDarkMode ? "#FFFFFF" : "#1E1F68"} />
        </div>
      </div>

      {error && <p className="text-red-500 mt-1 text-xs">{error}</p>}

      {isOpen && <SelectModal />}
    </div>
  );
};

export default CustomSelect;
