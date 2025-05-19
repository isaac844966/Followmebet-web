"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";

// Define the condition type
type ConditionType = "HT" | "FT" | string;

// Define props interface
interface ConditionCardProps {
  condition: ConditionType;
}

export const ConditionCard: React.FC<ConditionCardProps> = ({ condition }) => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const primaryBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";

  return (
    <div className={`${primaryBg} rounded-xl p-4 xs:p-3 mb-2`}>
      <p
        className={`${secondaryTextColor} uppercase text-xs xs:text-[10px] mb-2 xs:mb-1`}
      >
        CONDITION
      </p>
      <p className={`${textColor} font-medium xs:text-sm`}>
        {condition === "HT"
          ? "Half Time Result"
          : condition === "FT"
          ? "Full Time Result"
          : "Not Specified"}
      </p>
    </div>
  );
};
