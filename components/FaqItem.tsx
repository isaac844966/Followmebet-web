"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FaqItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({
  question,
  answer,
  isExpanded,
  onToggle,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`overflow-hidden rounded-lg mb-4 xs:mb-3 ${
        isDarkMode ? "bg-primary-1400" : "bg-white"
      } shadow-sm transition-all duration-200`}
    >
      <button
        className={`w-full px-6 xs:px-4 py-4 xs:py-3 flex justify-between items-center text-left ${
          isDarkMode ? "text-white" : "text-primary-100"
        }`}
        onClick={onToggle}
      >
        <span className="font-semibold xs:text-sm">{question}</span>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 xs:h-4 xs:w-4 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 xs:h-4 xs:w-4 flex-shrink-0" />
        )}
      </button>

      <div
        className={`px-6 xs:px-4 overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 pb-6 xs:pb-4" : "max-h-0"
        }`}
      >
        <div
          className={`${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          } xs:text-sm`}
        >
          {answer}
        </div>
      </div>
    </div>
  );
};

export default FaqItem;
