"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import CustomInput from "./CustomInput";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  countryCode?: string;
  containerStyle?: React.CSSProperties;
  onChangeText?: (text: string) => void;
  value?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label = "Phone Number",
  error,
  countryCode = "+234",
  containerStyle,
  onChangeText,
  value,
  ...props
}) => {
  const { isDarkMode } = useTheme();
  const [inputValue, setInputValue] = useState(value || "");

  // Update input value when the prop value changes (from outside)
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // Handle text input changes with numeric validation
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric characters
    const numericValue = e.target.value.replace(/[^0-9]/g, "");

    setInputValue(numericValue);

    // Pass the filtered numeric input to parent component
    if (onChangeText) {
      onChangeText(numericValue);
    }
  };

  return (
    <CustomInput
      label={label}
      type="tel"
      inputMode="numeric" 
      pattern="[0-9]*" 
      placeholder="Phone Number"
      value={inputValue}
      onChange={handleChangeText}
      error={error}
      maxLength={10} 
      leftComponent={
        <span
          className="text-lg font-bold"
          style={{
            color: isDarkMode ? "white" : "black",
          }}
        >
          {countryCode}
        </span>
      }
      {...props}
    />
  );
};

export default PhoneInput;
