"use client";

import type React from "react";

export type BetCondition = "FT" | "HT";

type BetConditionSelectorProps = {
  selectedCondition: BetCondition | null;
  onSelectCondition: (condition: BetCondition) => void;
  isDarkMode: boolean;
};

const BetConditionSelector: React.FC<BetConditionSelectorProps> = ({
  selectedCondition,
  onSelectCondition,
  isDarkMode,
}) => {
  const textColor = isDarkMode ? "text-white" : "text-black";
  const cardBackground = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";
  const activeButtonBg = isDarkMode ? "bg-[#2E3192]" : "bg-[#2E3192]";
  const inactiveButtonBg = isDarkMode ? "bg-[#27274d]" : "bg-[#E8E8FF]";
  const activeButtonText = "text-white";
  const inactiveButtonText = isDarkMode ? "text-white" : "text-black";

  return (
    <div className="mb-4">
      <p className={`${textColor} text-base font-medium mb-2`}>
        Choose condition
      </p>

      <div
        className={`flex justify-between ${cardBackground} rounded-lg py-3 px-2 border-[0.2px] border-gray-600`}
      >
        <button
          className={`${
            selectedCondition === "FT" ? activeButtonBg : inactiveButtonBg
          } py-3 px-2 rounded-md flex-1 mr-1 ${
            selectedCondition === "FT" ? `border-[0.2px] border-gray-600` : ""
          }`}
          onClick={() => onSelectCondition("FT")}
        >
          <span
            className={`${
              selectedCondition === "FT" ? activeButtonText : inactiveButtonText
            } text-center text-sm font-medium`}
          >
            Full Time Result
          </span>
        </button>

        <button
          className={`${
            selectedCondition === "HT" ? activeButtonBg : inactiveButtonBg
          } py-3 px-2 rounded-md flex-1 ml-2 ${
            selectedCondition === "HT" ? `border-[0.2px] border-gray-600` : ""
          }`}
          onClick={() => onSelectCondition("HT")}
        >
          <span
            className={`${
              selectedCondition === "HT" ? activeButtonText : inactiveButtonText
            } text-center text-sm font-medium`}
          >
            Half Time Result
          </span>
        </button>
      </div>
    </div>
  );
};

export default BetConditionSelector;
