"use client";

import type React from "react";
import { type ReactNode, useRef, useEffect } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string| ReactNode;
  message?: string | ReactNode;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onPrimaryButtonPress: () => void;
  onSecondaryButtonPress?: () => void;
  primaryButtonColor?: string;
  secondaryButtonColor?: string;
  primaryTextColor?: string;
  secondaryTextColor?: string;
  hideCloseOnOverlayPress?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  message,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryButtonPress,
  onSecondaryButtonPress,
  primaryButtonColor,
  secondaryButtonColor,
  primaryTextColor,
  secondaryTextColor,
  hideCloseOnOverlayPress = false,
}) => {
  const { isDarkMode } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  // Default colors based on theme
  const defaultPrimaryButtonColor = primaryButtonColor || "#FFA726";
  const defaultSecondaryButtonColor = secondaryButtonColor || "transparent";
  const defaultPrimaryTextColor = primaryTextColor || "#000000";
  const defaultSecondaryTextColor =
    secondaryTextColor || (isDarkMode ? "#FFFFFF" : "#000000");
  const borderColor = isDarkMode ? "#f1e7e7" : "#E0E0E0";

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hideCloseOnOverlayPress && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !hideCloseOnOverlayPress) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = ""; // Restore scrolling when modal is closed
    };
  }, [visible, hideCloseOnOverlayPress, onClose]);

  // Focus trap
  useEffect(() => {
    if (visible && modalRef.current) {
      modalRef.current.focus();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`${
          isDarkMode ? "bg-[#2D2A6E]" : "bg-white"
        } rounded-xl p-6  items-center max-w-[85%] w-[500px] shadow-lg`}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div
          id="modal-title"
          className="flex flex-col items-center justify-center gap-2 mb-6"
        >
          {title}
        </div>

        {/* Message */}
        {typeof message === "string" ? (
          <p
            className={`${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } text-lg mb-10 text-center leading-5 font-medium`}
          >
            {message}
          </p>
        ) : (
          <div className="mb-6">{message}</div>
        )}

        {/* Buttons */}
        <div className="flex w-full justify-between mt-2">
          {/* Primary Button */}
          <button
            className={`rounded-lg py-3 flex items-center justify-center ${
              secondaryButtonText ? "flex-1 mr-2" : "w-full"
            }`}
            style={{
              backgroundColor: defaultPrimaryButtonColor,
              color: defaultPrimaryTextColor,
            }}
            onClick={onPrimaryButtonPress}
          >
            <span className="text-base font-medium">{primaryButtonText}</span>
          </button>

          {/* Secondary Button (optional) */}
          {secondaryButtonText && (
            <button
              className="rounded-lg py-3 flex items-center justify-center flex-1 ml-2"
              style={{
                backgroundColor: defaultSecondaryButtonColor,
                border: `1px solid ${borderColor}`,
                color: defaultSecondaryTextColor,
              }}
              onClick={onSecondaryButtonPress || onClose}
            >
              <span className="text-base font-medium">
                {secondaryButtonText}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
