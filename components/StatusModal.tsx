"use client";

import type React from "react";
import type { ReactNode } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { AlertCircle, Check, CheckCircle, Info, X } from "lucide-react";

type StatusType = "success" | "error" | "warning" | "info";

interface StatusModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  buttonText?: string;
  type?: StatusType;
  customIcon?: ReactNode;
  hideCloseOnOverlayPress?: boolean;
  onButtonPress?: () => void;
  icon?: ReactNode;
}

const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  onClose,
  title,
  message,
  buttonText = "OK",
  type = "success",
  customIcon,
  hideCloseOnOverlayPress = false,
  onButtonPress,
  icon,
}) => {
  const { isDarkMode } = useTheme();

  if (!visible) return null;

  const getTypeColors = () => {
    switch (type) {
      case "success":
        return {
          primary: "#4CAF50",
          light: "#E8F5E9",
          dark: "#2E7D32",
          buttonLight: "#FBB03B",
          buttonDark: "#0f0d3e",
        };
      case "error":
        return {
          primary: "#E53935",
          light: "#FFEBEE",
          dark: "#C62828",
          buttonLight: "#FBB03B",
          buttonDark: "#0f0d3e",
        };
      case "warning":
        return {
          primary: "#FFC107",
          light: "#FFF8E1",
          dark: "#F57F17",
          buttonLight: "#FBB03B",
          buttonDark: "#2D2A6E",
        };
      case "info":
        return {
          primary: "#2196F3",
          light: "#E3F2FD",
          dark: "#1565C0",
          buttonLight: "#FBB03B",
          buttonDark: "#2D2A6E",
        };
      default:
        return {
          primary: "#4CAF50",
          light: "#E8F5E9",
          dark: "#2E7D32",
          buttonLight: "#FBB03B",
          buttonDark: "#fff",
        };
    }
  };

  const colors = getTypeColors();
  const buttonColor = isDarkMode ? colors.buttonDark : colors.buttonLight;
  const buttonTextColor = "#FFFFFF";

  const handleOverlayPress = () => {
    if (!hideCloseOnOverlayPress) {
      onClose();
    }
  };

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    } else {
      onClose();
    }
  };

  const renderIcon = () => {
    if (icon) return icon;
    if (customIcon) return customIcon;

    switch (type) {
      case "success":
        return (
          <div className="w-20 h-20 xs:w-16 xs:h-16 rounded-full bg-[#4CAF50] flex items-center justify-center">
            <Check size={48} color="#FFFFFF" className="xs:w-8 xs:h-8" />
          </div>
        );
      case "error":
        return (
          <div className="w-20 h-20 xs:w-16 xs:h-16 rounded-full bg-[#E53935] flex items-center justify-center">
            <X size={48} color="#FFFFFF" className="xs:w-8 xs:h-8" />
          </div>
        );
      case "warning":
        return (
          <div className="w-20 h-20 xs:w-16 xs:h-16 rounded-full border-8 xs:border-6 border-yellow-500 flex items-center justify-center">
            <AlertCircle
              size={48}
              color={colors.primary}
              className="xs:w-8 xs:h-8"
            />
          </div>
        );
      case "info":
        return (
          <div className="w-20 h-20 xs:w-16 xs:h-16 rounded-full border-8 xs:border-6 border-blue-500 flex items-center justify-center">
            <Info size={48} color={colors.primary} className="xs:w-8 xs:h-8" />
          </div>
        );
      default:
        return (
          <div className="w-20 h-20 xs:w-16 xs:h-16 rounded-full border-8 xs:border-6 border-primary-400 flex items-center justify-center">
            <CheckCircle
              size={48}
              color={colors.primary}
              className="xs:w-8 xs:h-8"
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <div
          className={`${
            isDarkMode ? "bg-[#2D2A6E]" : "bg-white"
          } rounded-xl p-6 xs:p-4 items-center flex flex-col max-w-md w-[85vw] shadow-lg`}
        >
          <div className="mb-6 xs:mb-4 mt-2">{renderIcon()}</div>

          {title && (
            <h3
              className={`${
                isDarkMode ? "text-white" : "text-black"
              } text-xl xs:text-lg font-bold mb-3 xs:mb-2 text-center`}
            >
              {title}
            </h3>
          )}

          <p
            className={`${
              isDarkMode ? "text-white/80" : "text-gray-700"
            } text-base xs:text-sm mb-16 xs:mb-10 text-center font-medium leading-6`}
          >
            {message}
          </p>

          <button
            className="w-full rounded-lg py-4 xs:py-3 items-center justify-center flex"
            style={{ backgroundColor: buttonColor }}
            onClick={handleButtonPress}
          >
            <span
              className="text-base xs:text-sm font-medium"
              style={{ color: buttonTextColor }}
            >
              {buttonText}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
