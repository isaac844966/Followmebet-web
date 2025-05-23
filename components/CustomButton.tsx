"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  textClassName?: string;
  buttonStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  textStyle,
  buttonStyle,
  className,
  textClassName,
  ...props
}) => {
  const { isDarkMode } = useTheme();

  // Size classes with responsive variants - increased from previous version
  const sizeClasses = {
    sm: "py-2 px-4 xs:py-1.5 xs:px-3.5",
    md: "py-3 px-5 xs:py-2.5 xs:px-4.5",
    lg: "py-4 px-6 xs:py-3.5 xs:px-5",
  };

  // Text size classes with responsive variants - slightly larger than previous
  const textSizeClasses = {
    sm: "text-sm xs:text-xs",
    md: "text-base xs:text-sm",
    lg: "text-lg xs:text-base",
  };

  // Variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return `bg-primary-400 ${
          disabled ? "opacity-50" : ""
        } shadow-lg shadow-primary-900/20`;
      case "secondary":
        return `bg-primary-100 ${disabled ? "opacity-50" : ""}`;
      case "outline":
        return `border ${
          isDarkMode ? "border-white" : "border-primary-100"
        } bg-transparent ${disabled ? "opacity-50" : ""}`;
      default:
        return `bg-primary-400 ${disabled ? "opacity-50" : ""}`;
    }
  };

  // Text color classes
  const getTextColorClass = () => {
    switch (variant) {
      case "primary":
      case "secondary":
        return "text-white";
      case "outline":
        return isDarkMode ? "text-white" : "text-primary-100";
      default:
        return "text-white";
    }
  };

  return (
    <button
      className={`rounded-lg justify-center items-center flex ${
        sizeClasses[size]
      } ${getVariantClasses()} ${
        loading || disabled ? "opacity-70 cursor-not-allowed" : ""
      } ${className ?? ""}`}
      disabled={loading || disabled}
      style={{ ...buttonStyle, borderRadius: "0.5rem" }}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 xs:w-4.5 xs:h-4.5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
      ) : (
        <span
          className={`font-bold ${
            textSizeClasses[size]
          } ${getTextColorClass()} ${textClassName ?? ""}`}
          style={textStyle}
        >
          {title}
        </span>
      )}
    </button>
  );
};

export default CustomButton;
