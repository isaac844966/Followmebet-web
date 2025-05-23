"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { ChevronRight } from "lucide-react";
import { Loader2 } from "lucide-react";

interface ActionItemProps {
  title: string;
  icon?: React.ReactNode;
  actionText?: string;
  onPress?: () => void;
  bgColor?: string;
  containerStyle?: React.CSSProperties;
  loading?: boolean;
}

const ActionItem: React.FC<ActionItemProps> = ({
  title,
  icon,
  actionText,
  onPress,
  bgColor,
  containerStyle,
  loading = false,
}) => {
  const { isDarkMode } = useTheme();

  // Default background colors based on theme
  const defaultBgColor =
    bgColor || (isDarkMode ? "bg-primary-1400" : "bg-blue-50");

  return (
    <button
      onClick={onPress}
      className={`${defaultBgColor} rounded-lg p-6 ms:p-4 xs:p-2 mb-2 flex items-center justify-between w-full`}
      style={containerStyle}
      disabled={loading}
    >
      <div className="flex items-center">
        {icon}
        <span
          className={`${
            isDarkMode ? "text-white" : "text-black"
          } ml-3 font-semibold text-lg sm:text-md xs:text-sm`}
        >
          {title}
        </span>
      </div>

      <div className="flex items-center">
        {actionText && (
          <span className="text-gray-400 mr-2 text-sm xs:text-xs font-semibold">
            {actionText}
          </span>
        )}
        {loading ? (
          <Loader2 size={16} className="animate-spin text-gray-400" />
        ) : (
          <ChevronRight
            size={12}
            className={isDarkMode ? "text-white" : "text-[#1E1F68]"}
          />
        )}
      </div>
    </button>
  );
};

export default ActionItem;
