"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";

// Define props interface
interface StakeCardProps {
  totalAmount: number;
}

export const StakeCard: React.FC<StakeCardProps> = ({ totalAmount }) => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const primaryBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";

  return (
    <div className={`${primaryBg} rounded-xl p-4 xs:p-3 mb-2`}>
      <p
        className={`${secondaryTextColor} uppercase text-xs xs:text-[10px] mb-2 xs:mb-1`}
      >
        STAKE
      </p>
      <p className={`${textColor} font-medium xs:text-sm`}>
        ₦{(totalAmount / 2).toLocaleString()}
      </p>
    </div>
  );
};
