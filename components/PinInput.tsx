"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";

interface PinInputProps {
  value: string;
  maxLength: number;
  onChange?: (value: string) => void;
}

const PinInput: React.FC<PinInputProps> = ({
  value,
  maxLength = 4,
  onChange,
}) => {
  const { isDarkMode } = useTheme();
  const [pins, setPins] = useState<string[]>(Array(maxLength).fill(""));

  useEffect(() => {
    // Update pins array when value changes
    const valueArray = value.split("");
    const newPins = Array(maxLength).fill("");

    valueArray.forEach((char, index) => {
      if (index < maxLength) {
        newPins[index] = char;
      }
    });

    setPins(newPins);
  }, [value, maxLength]);

  return (
    <div className="flex justify-center gap-2 xs:gap-1 space-x-4 xs:space-x-2 mb-10 xs:mb-6">
      {pins.map((pin, index) => (
        <div
          key={index}
          className={`${
            isDarkMode ? "bg-primary-1400" : "bg-[#E8E8FF]"
          } w-20 xs:w-14 h-24 xs:h-16 rounded-lg flex items-center justify-center`}
        >
          {pin ? (
            <div
              className={`${
                isDarkMode ? "bg-white" : "bg-black"
              } w-3 xs:w-2 h-3 xs:h-2 rounded-full`}
            ></div>
          ) : (
            <span
              className={`${
                isDarkMode ? "text-white" : "text-black"
              } text-3xl xs:text-2xl font-bold`}
            >
              -
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default PinInput;
