"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";

interface StatCardDisplayProps {
  title: string;
  value: number | string;
  valueColor?: string;
  backgroundColor?: string;
  containerStyle?: React.CSSProperties;
  fullWidth?: boolean;
}

const StatCardDisplay: React.FC<StatCardDisplayProps> = ({
  title,
  value,
  valueColor,
  backgroundColor,
  containerStyle,
  fullWidth = false,
}) => {
  const { isDarkMode } = useTheme();

  const getDefaultColor = () => {
    if (title.toLowerCase().includes("win")) return "#00C927";
    if (title.toLowerCase().includes("loss")) return "#FC0900";
    if (title.toLowerCase().includes("draw")) return "#FBB03B";
    return isDarkMode ? "#FFFFFF" : "#1E1F68";
  };

  const textColor = valueColor || getDefaultColor();

  // Get the background color based on props or default
  const bgColor =
    backgroundColor || (isDarkMode ? "bg-primary-1400" : "bg-blue-50");

  // Determine if the background color is a Tailwind class or a custom color
  const isTailwindClass = bgColor.startsWith("bg-");

  return (
    <div
      className={`rounded-lg p-6 xs:p-4 mb-2 ${
        fullWidth ? "w-full" : "flex-1"
      } ${isTailwindClass ? bgColor : ""}`}
      style={{
        ...containerStyle,
        ...(isTailwindClass ? {} : { backgroundColor: bgColor }),
      }}
    >
      <p
        className={`${
          isDarkMode ? "text-primary-1200" : "text-black"
        } text-xs xs:text-[10px] font-semibold mb-2`}
      >
        {title}
      </p>
      <p
        className="text-3xl xs:text-2xl font-bold mt-2"
        style={{ color: textColor }}
      >
        {value}
      </p>
    </div>
  );
};

export default StatCardDisplay;
