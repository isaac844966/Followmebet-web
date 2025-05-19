"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { X } from "lucide-react";

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({ onKeyPress }) => {
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "backspace"],
  ];
  const { isDarkMode } = useTheme();

  return (
    <div className="w-full">
      {keys.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex justify-around mb-8 xs:mb-5 gap-2 xs:gap-1"
        >
          {row.map((key, keyIndex) => (
            <button
              key={`key-${rowIndex}-${keyIndex}`}
              onClick={() => onKeyPress(key)}
              className={`w-16 xs:w-12 h-16 xs:h-12 flex items-center justify-center ${
                !key ? "opacity-0" : ""
              }`}
              disabled={!key}
            >
              {key === "backspace" ? (
                <X
                  size={40}
                  className={`${
                    isDarkMode ? "text-white" : "text-black font-bold"
                  } xs:w-8 xs:h-8`}
                />
              ) : (
                <span
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } text-4xl xs:text-2xl font-bold`}
                >
                  {key}
                </span>
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default NumericKeypad;
