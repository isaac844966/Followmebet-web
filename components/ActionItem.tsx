"use client";

import type React from "react";

import { useTheme } from "@/lib/contexts/ThemeContext";
import { ChevronRight } from "lucide-react";

interface ActionItemProps {
  title: string;
  icon?: React.ReactNode;
  actionText?: string;
  onPress?: () => void;
  bgColor?: string;
  containerStyle?: React.CSSProperties;
}

const ActionItem: React.FC<ActionItemProps> = ({
  title,
  icon,
  actionText,
  onPress,
  bgColor,
  containerStyle,
}) => {
  const { isDarkMode } = useTheme();

  // Default background colors based on theme
  const defaultBgColor =
    bgColor || (isDarkMode ? "bg-primary-1400" : "bg-blue-50");

  return (
    <button
      onClick={onPress}
      className={`${defaultBgColor} rounded-lg p-6 py-7 mb-2 flex items-center justify-between w-full`}
      style={containerStyle}
    >
      <div className="flex items-center">
        {icon}
        <span
          className={`${
            isDarkMode ? "text-white" : "text-black"
          } ml-3 font-semibold text-lg`}
        >
          {title}
        </span>
      </div>

      <div className="flex items-center">
        {actionText && (
          <span className="text-gray-400 mr-2 text-sm font-semibold">
            {actionText}
          </span>
        )}
        <ChevronRight size={12} color={isDarkMode ? "white" : "#1E1F68"} />
      </div>
    </button>
  );
};

export default ActionItem;
