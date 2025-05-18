"use client";

import type React from "react";
import { useState } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { Eye, EyeOff } from "lucide-react";

interface CustomInputProps {
  label?: string;
  leftComponent?: React.ReactNode;
  isPassword?: boolean;
  error?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editable?: boolean;
  className?: string;
  maxLength?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  leftComponent,
  isPassword = false,
  error,
  placeholder,
  value,
  onChangeText,
  onChange,
  editable = true,
  className,
  maxLength,
  ...props
}) => {
  const { isDarkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
    if (onChangeText) {
      onChangeText(e.target.value);
    }
  };

  return (
    <div className="mb-3 xs:mb-2">
      {label && (
        <label
          className={`${
            isDarkMode ? "text-white" : "text-black"
          } mb-3 xs:mb-2 font-bold block text-base xs:text-sm`}
        >
          {label}
        </label>
      )}
      <div className="flex">
        {leftComponent && (
          <div
            className={`${
              isDarkMode ? "bg-primary-1400" : "bg-primary-1200"
            } rounded-l-lg justify-center items-center flex border-r-[0.2px] ${
              isDarkMode ? "bg-primary-1400" : "border-primary-800"
            }`}
            style={{ width: leftComponent ? 80 : 0 }}
          >
            {leftComponent}
          </div>
        )}
        <div className="relative flex-1">
          <input
            className={`${
              isDarkMode
                ? "bg-primary-1400 text-white"
                : "bg-primary-1200 text-black"
            } ${
              leftComponent ? "rounded-r-lg" : "rounded-lg"
            } h-20 xs:h-16 px-4 xs:px-3 ${
              isPassword ? "pr-12 xs:pr-10" : ""
            } font-bold text-base xs:text-sm w-full ${className || ""} ${
              !editable ? "opacity-70 cursor-not-allowed" : ""
            }`}
            placeholder={placeholder || ""}
            type={isPassword && !showPassword ? "password" : "text"}
            autoComplete={isPassword ? "off" : "on"}
            value={value || ""}
            onChange={handleChange}
            disabled={!editable}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-4 xs:right-3 top-6 xs:top-5"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff
                  className="w-6 h-6 xs:w-5 xs:h-5"
                  color={isDarkMode ? "#6b6b9b" : "#A0A3AC"}
                />
              ) : (
                <Eye
                  className="w-6 h-6 xs:w-5 xs:h-5"
                  color={isDarkMode ? "#6b6b9b" : "#A0A3AC"}
                />
              )}
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 mt-1 text-xs">{error}</p>}
    </div>
  );
};

export default CustomInput;
