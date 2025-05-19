"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { X } from "lucide-react";
import CustomButton from "./CustomButton";

interface TransactionFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (fromDate: Date | null, toDate: Date | null) => void;
  onClear: () => void;
  initialFromDate: Date | null;
  initialToDate: Date | null;
}

const TransactionFilterModal: React.FC<TransactionFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  onClear,
  initialFromDate,
  initialToDate,
}) => {
  const { isDarkMode } = useTheme();
  const [fromDate, setFromDate] = useState<Date | null>(initialFromDate);
  const [toDate, setToDate] = useState<Date | null>(initialToDate);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const backgroundColor = isDarkMode ? "#0B0B3F" : "#FFFFFF";
  const textColor = isDarkMode ? "#FFFFFF" : "#000000";
  const inputBgColor = isDarkMode ? "#1E1F68" : "#F5F5F5";
  const borderColor = isDarkMode ? "#2D2F8E" : "#EEEEEE";
  const buttonActiveBg = isDarkMode ? "#2D2F8E" : "#E8E8FF";
  const buttonInactiveBg = isDarkMode ? "#1E1F68" : "#F5F5F5";
  const buttonActiveText = isDarkMode ? "#FFFFFF" : "#4A3AFF";
  const buttonInactiveText = isDarkMode ? "#A0A3BD" : "#6E7191";

  // Update activeFilter when dates change
  useEffect(() => {
    if (initialFromDate && initialToDate) {
      // Try to determine if it's a 3-month or 6-month filter
      const today = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(today.getMonth() - 3);

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 6);

      // Check if dates approximately match 3-month or 6-month periods
      // Using getTime() / 86400000 to get days for rough comparison
      const fromDayDiff3Month = Math.abs(
        Math.floor(initialFromDate.getTime() / 86400000) -
          Math.floor(threeMonthsAgo.getTime() / 86400000)
      );

      const fromDayDiff6Month = Math.abs(
        Math.floor(initialFromDate.getTime() / 86400000) -
          Math.floor(sixMonthsAgo.getTime() / 86400000)
      );

      if (fromDayDiff3Month < 3) {
        setActiveFilter("3months");
      } else if (fromDayDiff6Month < 3) {
        setActiveFilter("6months");
      } else {
        setActiveFilter("custom");
      }
    } else {
      setActiveFilter(null);
    }
  }, [initialFromDate, initialToDate]);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  // Handle from date change
  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromDate(value ? new Date(value) : null);
    setActiveFilter("custom");
  };

  // Handle to date change
  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToDate(value ? new Date(value) : null);
    setActiveFilter("custom");
  };

  // Apply 3-month filter
  const apply3MonthFilter = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 3);

    setFromDate(startDate);
    setToDate(endDate);
    setActiveFilter("3months");
  };

  // Apply 6-month filter
  const apply6MonthFilter = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 6);

    setFromDate(startDate);
    setToDate(endDate);
    setActiveFilter("6months");
  };

  // Apply filters
  const handleApply = () => {
    onApply(fromDate, toDate);
  };

  // Clear filters
  const handleClear = () => {
    setFromDate(null);
    setToDate(null);
    setActiveFilter(null);
    onClear();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div
        className="w-full max-w-md rounded-t-xl p-6 xs:p-4 absolute bottom-0"
        style={{
          backgroundColor,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 xs:mb-4">
          <h2
            className="text-xl xs:text-lg font-bold"
            style={{ color: textColor }}
          >
            Filter By
          </h2>
          <button onClick={onClose}>
            <X size={24} color={textColor} className="xs:w-5 xs:h-5" />
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex space-x-3 xs:space-x-2 mb-6 xs:mb-4">
          <button
            className="flex-1 py-2 xs:py-1.5 px-4 xs:px-3 rounded-lg text-center xs:text-sm"
            style={{
              backgroundColor:
                activeFilter === "3months" ? buttonActiveBg : buttonInactiveBg,
              color:
                activeFilter === "3months"
                  ? buttonActiveText
                  : buttonInactiveText,
            }}
            onClick={apply3MonthFilter}
          >
            Last 3 months
          </button>
          <button
            className="flex-1 py-2 xs:py-1.5 px-4 xs:px-3 rounded-lg text-center xs:text-sm"
            style={{
              backgroundColor:
                activeFilter === "6months" ? buttonActiveBg : buttonInactiveBg,
              color:
                activeFilter === "6months"
                  ? buttonActiveText
                  : buttonInactiveText,
            }}
            onClick={apply6MonthFilter}
          >
            Last 6 months
          </button>
        </div>

        {/* From Date */}
        <div className="mb-4 xs:mb-3">
          <label
            className="block mb-2 xs:mb-1 font-medium xs:text-sm"
            style={{ color: textColor }}
          >
            From date
          </label>
          <input
            type="date"
            className="h-14 xs:h-12 px-4 xs:px-3 rounded-lg w-full xs:text-sm"
            style={{ backgroundColor: inputBgColor, color: textColor }}
            value={formatDate(fromDate)}
            onChange={handleFromDateChange}
          />
        </div>

        {/* To Date */}
        <div className="mb-6 xs:mb-4">
          <label
            className="block mb-2 xs:mb-1 font-medium xs:text-sm"
            style={{ color: textColor }}
          >
            To date
          </label>
          <input
            type="date"
            className="h-14 xs:h-12 px-4 xs:px-3 rounded-lg w-full xs:text-sm"
            style={{ backgroundColor: inputBgColor, color: textColor }}
            value={formatDate(toDate)}
            onChange={handleToDateChange}
          />
        </div>

        {/* Buttons */}
        <div className="mb-4 xs:mb-3">
          <CustomButton
            title="Filter"
            size="lg"
            onClick={handleApply}
            className="w-full"
          />
        </div>

        <button
          className="w-full text-center py-2 xs:text-sm"
          onClick={handleClear}
        >
          <span className="text-primary-400 font-medium">Clear filter</span>
        </button>
      </div>
    </div>
  );
};

export default TransactionFilterModal;
