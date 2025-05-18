"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  autoFocus = false,
}) => {
  const { isDarkMode } = useTheme();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Initialize array with the correct length
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
    // Focus first input on mount if autoFocus is true
    if (autoFocus && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [length, autoFocus]);

  const handleChange = (text: string, index: number) => {
    // Handle paste event (when text length > 1)
    if (text.length > 1) {
      handlePaste(text, index);
      return;
    }

    const newValue = value.split("");

    // Only accept single digits
    if (text.length <= 1) {
      newValue[index] = text;
      onChange(newValue.join(""));

      // Auto advance to next input if a digit was entered
      if (text.length === 1 && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (value[index] === "" || value[index] === undefined) {
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        const newValue = value.split("");
        newValue[index] = "";
        onChange(newValue.join(""));
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  // Handle paste functionality
  const handlePaste = (pastedText: string, currentIndex: number) => {
    // Filter out non-digit characters
    const digits = pastedText
      .replace(/[^0-9]/g, "")
      .slice(0, length - currentIndex);

    if (digits.length > 0) {
      // Create a new value array with pasted digits
      const newValue = value.split("");
      for (let i = 0; i < digits.length; i++) {
        const targetIndex = currentIndex + i;
        if (targetIndex < length) {
          newValue[targetIndex] = digits[i];
        }
      }
      onChange(newValue.join(""));

      // Focus the next empty input or the last input
      const nextIndex = Math.min(currentIndex + digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  // Create an array of the correct length
  const inputs = Array(length).fill(0);

  return (
    <div className="flex justify-between w-full gap-2 xs:gap-1">
      {inputs.map((_, index) => {
        const isFocused = focusedIndex === index;
        const hasValue = value[index] !== undefined && value[index] !== "";

        return (
          <div
            key={index}
            className={`
              h-16 xs:h-14 flex justify-center items-center rounded-md
              ${isDarkMode ? "bg-primary-1400" : "bg-gray-100"}
              ${isFocused ? "border border-primary-400" : ""}
            `}
          >
            <input
              ref={(ref) => (inputRefs.current[index] = ref)}
              className={`
                w-full h-full text-center text-xl xs:text-lg font-bold
                ${isDarkMode ? "text-white" : "text-primary-100"}
                bg-transparent outline-none
              `}
              type="text"
              inputMode="numeric"
              maxLength={10} // Increased to allow paste detection
              value={value[index] || ""}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              style={{ caretColor: isDarkMode ? "#FFA726" : "#FBB03B" }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default OtpInput;
