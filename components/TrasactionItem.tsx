"use client";

import type React from "react";

import { useTheme } from "@/lib/contexts/ThemeContext";

export interface TransactionItemProps {
  id: string;
  date: string;
  time: string;
  amount: number;
  type: "Deposit" | "Withdrawal";
  status: string; // raw status string from API
  bankAccountNumber?: string | null;
  onRedeposit?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  id,
  date,
  time,
  amount,
  type,
  status,
  bankAccountNumber,
  onRedeposit,
}) => {
  const { isDarkMode } = useTheme();

  // Determine text color based on status keywords
  const getStatusColor = () => {
    const lower = status.toLowerCase();
    if (lower.includes("success") || lower.includes("reversed")) {
      return "text-green-500";
    } else if (lower.includes("pending")) {
      return "text-yellow-500";
    } else if (lower.includes("fail")) {
      return "text-red-500";
    }
    return "text-gray-400";
  };

  // Format raw status into human-readable label
  const label = status
    .replace(/\./g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div
      className={`p-4 rounded-lg mb-2 ${
        isDarkMode ? "bg-primary-1400" : "bg-primary-1200"
      }`}
    >
      {/* Date/Time and Type */}
      <div className="flex justify-between items-center mb-2">
        <p
          className={`text-xs ${
            isDarkMode ? "text-gray-300" : "text-gray-500"
          }`}
        >
          {date} {time}
        </p>
        {bankAccountNumber ? (
          <p
            className={`text-xs mb-2 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Account: {bankAccountNumber}
          </p>
        ) : (
          <p
            className={`text-sm font-medium ${
              isDarkMode ? "text-white" : "text-gray-700"
            }`}
          >
            {type}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p
            className={`text-lg font-bold ${
              isDarkMode ? "text-white" : "text-primary-1400"
            }`}
          >
            ₦{amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className={getStatusColor()}>{label}</p>
        </div>

        {/* Show Re-deposit button only on Deposit */}
        {type === "Deposit" && onRedeposit && (
          <button
            onClick={onRedeposit}
            className="bg-yellow-500 py-2 px-4 rounded-md"
          >
            <span className="text-white font-medium text-sm">Re‑deposit</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;
