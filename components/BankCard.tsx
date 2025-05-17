"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { BanknoteIcon as Bank, Trash2, Loader2 } from "lucide-react";

interface BankCardProps {
  bank: {
    id: string;
    bankName: string;
    accountNumber: string;
    accountName?: string;
  };
  onDelete: () => void;
  isDeleting: boolean;
}

const BankCard: React.FC<BankCardProps> = ({ bank, onDelete, isDeleting }) => {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? "bg-primary-1400" : "bg-blue-50";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";

  return (
    <div className={`${backgroundColor} rounded-lg p-4 mb-2`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`${
              isDarkMode ? "bg-[#2E3192]" : "bg-blue-100"
            } p-2 rounded-full`}
          >
            <Bank
              size={20}
              className={isDarkMode ? "text-white" : "text-[#1E1F68]"}
            />
          </div>
          <div className="ml-3">
            <p className={`${textColor} font-medium`}>{bank.bankName}</p>
            <p className={secondaryTextColor}>
              {bank.accountNumber.replace(/\d(?=\d{4})/g, "*")}
            </p>
          </div>
        </div>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50"
          aria-label="Delete bank account"
        >
          {isDeleting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Trash2 size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default BankCard;
